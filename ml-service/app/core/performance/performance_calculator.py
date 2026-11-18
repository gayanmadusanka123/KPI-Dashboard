import numpy as np
import pandas as pd

def calculate_kpi_performance(
        df,
        kpi_name,
        config,
        date_column=None,
        rolling_window=3
):
    actual = df[kpi_name].astype(float)

    target = float(config["target"])
    direction = config["direction"]

    if target <= 0:
        raise ValueError(
            f"Target for {kpi_name} must be greater than zero."
        )

    if direction not in ["HIGHER_BETTER", "LOWER_BETTER"]:
        raise ValueError(
            f"Invalid direction for {kpi_name}"
        )

    result = pd.DataFrame(index=df.index)

    result["KPI"] = kpi_name
    result["Actual"] = actual
    result["Target"] = target

    result["Raw Variance"] = actual - target

    if direction == "HIGHER_BETTER":
        result["Variance"] = actual - target
    else:
        result["Variance"] = target - actual

    result["Variance %"] = (result["Variance"] / target) * 100

    if direction == "HIGHER_BETTER":
        result["Performance Score"] = (actual / target) * 100
    else:
        result["Performance Score"] = np.where(
            actual == 0,
            np.inf,
            (target / actual) * 100
        )

    # Period-on-period change
    raw_pop = actual.pct_change() * 100

    if direction == "HIGHER_BETTER":
        result["PoP Change %"] = raw_pop
    else:
        result["PoP Change %"] = -raw_pop

    # Rolling average of performance scores
    result["Rolling Average"] = (
        result["Performance Score"]
        .rolling(
            window=rolling_window,
            min_periods=1
        )
        .mean()
    )

    #cumulative average performance
    result["Cumulative Performance"] = (
        result["Performance Score"].expanding().mean()
    )

    return result.reset_index(names="Date")


def calculate_all_kpi_performance(
    df,
    kpi_config,
    rolling_window=3
):
    """
    Calculate performance metrics for all configured KPIs.
    """

    all_results = []

    for kpi_name, config in kpi_config.items():

        if kpi_name not in df.columns:
            print(f"Skipping missing KPI: {kpi_name}")
            continue

        result = calculate_kpi_performance(
            df=df,
            kpi_name=kpi_name,
            config=config,
            rolling_window=rolling_window
        )

        all_results.append(result)

    if not all_results:
        raise ValueError("No KPI performance results generated.")

    return pd.concat(
        all_results,
        ignore_index=True
    )



