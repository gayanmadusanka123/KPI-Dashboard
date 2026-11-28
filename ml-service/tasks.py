# to run the celery
# celery -A celery_app:celery_app worker --loglevel=INFO --pool=solo
import os
import sys
import pandas as pd
from celery_app import celery_app
import requests

from app.core.performance.performance_service import (run_performance_engine)
from app.core.performance.performance_service import (run_performance_for_kpi)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sys.path.insert(0, os.path.join(BASE_DIR, "synthetic"))
sys.path.insert(0, os.path.join(BASE_DIR, "app", "core"))

from synthetic.synthetic_generator import generateRecords
from app.core.preprocessing import clean_time_series
from app.core.forecasting import forecast_all_kpis

SPRING_BOOT_URL = os.getenv(
    "SPRING_BOOT_URL",
    "http://localhost:8081"
)

KPI_ID_MAP = {
    "Revenue": "7b9e8400-e29b-41d4-a716-446655440000"
}

KPI_COLUMNS = ["Revenue"]

SYNTHETIC_KPI_COLUMNS = [
    'Traffic',
    'Conversion',
    'No of Conversions',
    'Revenue',
    'Operational Cost',
    'Head Count',
    'Defect Rate',
    'On Time Delivery',
    'CSAT'
]

def fetch_kpi_observations(kpi_id):
    """Fetch real historical observations from spring boot."""

    url = (
        f"{SPRING_BOOT_URL}/api/kpi-actuals/"
        f"observations/{kpi_id}"
    )

    """
    token = os.getenv("SPRING_BOOT_JWT_TOKEN")

        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        response = requests.get(
            url,
            headers=headers,
            timeout=30
        )
    """
    response = requests.get(url, timeout=30)
    response.raise_for_status()

    observations = response.json()

    if not observations:
        raise ValueError(
            f"No actual observations found for KPI {kpi_id}"
        )

    df = pd.DataFrame(observations)

    df = df.rename(columns={
        "periodStart": "date",
        "actualValue": "actual"
    })

    df["date"] = pd.to_datetime(df["date"])

    df["actual"] = pd.to_numeric(
        df["actual"],
        errors="raise"
    )

    return df[["date", "actual"]]

@celery_app.task(
    bind=True,
    name="tasks.forecast_kpi_task"
)  
def forecast_kpi_task(self, kpi_id, periods=3):

    try:
        print(f"Starting forecasting for KPI: {kpi_id}")

        df = fetch_kpi_observations(kpi_id)

        print(f"Fetched {len(df)} observations.")
        print(df.head().to_string(index=False))

        kpi_columns = ["actual"]

        cleaned_df = clean_time_series(
            df,
            kpi_columns=kpi_columns
        )

        forecasts = forecast_all_kpis(
            cleaned_df, kpi_columns, periods=periods
        )

        forecasts.columns = (
            forecasts.columns.str.strip().str.replace(" ", "_")
        )

        if forecasts.empty:
            raise ValueError(
                "No forecasts generated. Check the observation "
                "count and model-selection rules."
            )

        print("Forecast results: ")
        print(forecasts.to_string(index=False))

        payload = []

        for row in forecasts.itertuples(index=False):
            payload.append({
                "kpiId": str(kpi_id),
                "forecastDate": pd.Timestamp(
                    row.date
                ).strftime("%Y-%m-%d"),
                "forecastValue": float(row.forecast),
                "lowerBound": float(row.lower_bound),
                "upperBound": float(row.upper_bound),
                "modelName": row.model
            })

        response = requests.post(
            f"{SPRING_BOOT_URL}/api/forecasts/batch",
            json=payload,
            timeout=30
        )

        response.raise_for_status()

        result = {
            "status": "SUCCESS",
            "kpiId": str(kpi_id),
            "actualObservations": len(df),
            "forecastRowsSent": len(payload),
            "modelName": str(forecasts.iloc[0]["model"]),
            "springBootStatus": response.status_code
        }

        print(f"Forecasting completed: {result}")

        return result

    except Exception as exc:
        print(f"Forecasting failed for KPI {kpi_id}: {exc}")

        raise

    

@celery_app.task(
    bind=True,
    name="tasks.calculate_kpi_performance"
)
def calculate_kpi_performance_task(self, kpi_id):
    try:
        print(f"Starting performance calculation for KPI: {kpi_id}")

        performance_df = run_performance_for_kpi(kpi_id)

        result = {
            "status": "SUCCESS",
            "kpiId": str(kpi_id),
            "periodsCalculated": len(performance_df)
        }

        print(f"Performance calculation completed: {result}")

        return result

    except Exception as exc:
        print(f"Performance calculation failed for KPI {kpi_id}: {exc}")
        raise