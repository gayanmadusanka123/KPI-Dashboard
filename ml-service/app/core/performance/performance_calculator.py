import numpy as np
import pandas as pd

def calculate_kpi_performance(
        df,
        kpi_name,
        direction,
        rolling_window=3,
        score_cap=200
):

    if direction not in ["HIGHER_BETTER", "LOWER_BETTER"]:
        raise ValueError(
            f"Invalid direction for {kpi_name}: {direction}"
        )

    actual = pd.to_numeric(df["Actual"], errors="coerce")
    target = pd.to_numeric(df["Target"], errors="coerce")
    valid_target = target > 0

    if direction == "HIGHER_BETTER":
        variance = actual - target
        performance_score = (actual / target) * 100
    else:
        variance = target - actual
        performance_score = (target / actual) * 100

        performance_score = performance_score.where(
            actual != 0,
            score_cap
        )

        performance_score = performance_score.clip(
            upper=score_cap
        )

    # Do not calculate when actual or target is missing,
    # or when target is invalid.
    valid_data = actual.notna() & target.notna() & valid_target

    variance = variance.where(valid_data)

    performance_score = performance_score.where(valid_data)

    #variance percentage
    variance_percent = (variance / target) * 100

    #period on period change
    raw_pop = actual.pct_change(fill_method=None) * 100

    raw_pop = raw_pop.replace(
        [np.inf, -np.inf],
        np.nan
    )

    if direction == "HIGHER_BETTER":
        pop_change = raw_pop
    else:
        pop_change = -raw_pop

    result = pd.DataFrame(index=df.index)

    result["KPI"] = kpi_name
    result["Direction"] = direction

    result["Period ID"] = df["Period ID"]
    result["Date"] = pd.to_datetime(df["Date"])

    result["Actual"] = actual
    result["Target"] = target

    result["Raw Variance"] = actual - target
    result["Variance"] = variance
    result["Variance %"] = variance_percent

    result["Performance Score"] = performance_score
    result["PoP Change %"] = pop_change

    result["Rolling Average"] = (
        performance_score.rolling(
            window=rolling_window,
            min_periods=1
        ).mean()
    )

    # Cumulative average performance
    result["Cumulative Performance"] = (
        performance_score.expanding(
            min_periods=1
        ).mean()
    )

    return result.reset_index(drop=True)

def calculate_all_kpi_performance(
    performance_inputs,
    rolling_window=3
):
    """
    Calculate performance metrics for all configured KPIs.
    """

    all_results = []

    for item in performance_inputs:

        result = calculate_kpi_performance(
            df=item["data"],
            kpi_name=item["kpi_name"],
            direction=item["direction"],
            rolling_window=rolling_window
        )

        all_results.append(result)

    if not all_results:
        raise ValueError(
            "No KPI performance results generated."
        )

    return pd.concat(
        all_results,
        ignore_index=True
    )



