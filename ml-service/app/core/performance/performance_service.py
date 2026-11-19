import requests
import pandas as pd
import numpy as np

from app.core.performance.kpi_config import (
    PERFORMANCE_SETTINGS
)

from app.core.performance.performance_calculator import(
    calculate_all_kpi_performance
)

from app.core.performance.status_calculator import(
    add_status_badges
)

from app.core.performance.trend_calculator import(
    add_trend_direction
)

SPRING_BOOT_BASE_URL = "http://localhost:8081"

def fetch_performance_inputs(kpi_id):

    url = (
        f"{SPRING_BOOT_BASE_URL}/api/performance/inputs/{kpi_id}"
    )

    response = requests.get(
        url,
        timeout=30
    )

    response.raise_for_status()

    return response.json()

def prepare_performance_data(api_response):

    kpi_name = api_response["kpiName"]
    direction = api_response["directionOfGood"]

    if direction not in ["HIGHER_BETTER","LOWER_BETTER"]:
        raise ValueError(f"Invalid KPI direction: {direction}")

    periods = api_response.get("periods", [])

    if not periods:
        raise ValueError(
            f"No periods found for KPI: {kpi_name}"
        )

    df = pd.DataFrame(periods)

    #converting springboot json field names to calculator
    df = df.rename(
        columns={
            "periodId": "Period ID",
            "periodStart": "Date",
            "actualValue": "Actual",
            "targetValue": "Target"
        }
    )

    required_columns = [
        "Period ID",
        "Date",
        "Actual",
        "Target"
    ]

    for column in required_columns:
        if column not in df.columns:
            raise ValueError(f"missing required column: {column}")

    df["Date"] = pd.to_datetime(
        df["Date"],
        errors="coerce"
    )

    df["Actual"] = pd.to_numeric(
        df["Actual"],
        errors="coerce"
    )

    df["Target"] = pd.to_numeric(
        df["Target"],
        errors="coerce"
    )

    df = df.sort_values(
        "Date"
    ).reset_index(drop=True)

    return {
        "kpi_name": kpi_name,
        "direction": direction,
        "data": df
    }

def run_performance_engine(api_response):

    performance_input = prepare_performance_data(api_response)

    performance_df = calculate_all_kpi_performance(
        [performance_input],
        rolling_window=PERFORMANCE_SETTINGS[
            "rolling_window"
        ]
    )

    performance_df = add_status_badges(
        performance_df,
        PERFORMANCE_SETTINGS["thresholds"]
    )

    performance_df = add_trend_direction(
        performance_df,
        n=PERFORMANCE_SETTINGS["trend_window"],
        stability_threshold=PERFORMANCE_SETTINGS[
            "stability_threshold"
        ]
    )

    return performance_df

def prepare_performance_results_payload(kpi_id, performance_df):

    results = []

    for _, row in performance_df.iterrows():

        result = {
            "periodId": str(row["Period ID"]),

            "performanceScore": row["Performance Score"],

            "variance": row["Variance"],

            "variancePercent": row["Variance %"],

            "periodChangePercent": row["PoP Change %"],

            "trendDirection": row["Trend Direction"],

            "rollingAverage": row["Rolling Average"],

            "cumulativePerformance": row["Cumulative Performance"],

            "status": row["Status"]
        }

        # convert panda values to JSON
        for key, value in result.items():

            if isinstance(value, (np.integer,)):
                result[key] = int(value)

            elif isinstance(value, (np.floating, float)):

                if np.isfinite(value):
                    result[key] = float(value)
                else:
                    result[key] = None

            elif pd.isna(value):
                result[key] = None

        results.append(result)

    payload = {
        "kpiId": str(kpi_id),
        "results": results
    }

    return payload

def save_performance_results(kpi_id, performance_df):

    url = (
        f"{SPRING_BOOT_BASE_URL}"
        "/api/performance/results/batch"
    )

    payload = prepare_performance_results_payload(
        kpi_id,
        performance_df
    )

    response = requests.post(
        url,
        json=payload,
        timeout=30
    )

    response.raise_for_status()

    print("Performance results saved successfully.")

    print(f"KPI ID: {kpi_id}")

    print(f"Periods saved: {len(payload['results'])}")

    print(f"Spring Boot response: {response.text}")

    return response


def run_performance_for_kpi(kpi_id):

    api_response = fetch_performance_inputs(kpi_id)
    performance_df = run_performance_engine(api_response)
    save_performance_results(kpi_id, performance_df)

    return performance_df