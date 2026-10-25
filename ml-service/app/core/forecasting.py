import pandas as pd

from models.linear_regression import forecast_linear_regression
from models.exponential_smoothing import forecast_exponential_smoothing
from models.sarima import forecast_sarima
from models.prophet import forecast_prophet

from model_selector import select_models_per_kpi

def forecast_kpi(series, kpi_name, model_name, periods=3):

    if model_name == "Linear Regression":
        return forecast_linear_regression(
            series,
            kpi_name,
            periods
        )
    elif model_name == "Exponential Smoothing":
        return forecast_exponential_smoothing(
            series,
            kpi_name,
            periods
        )
    elif model_name == "SARIMA":
        return forecast_sarima(
            series,
            kpi_name,
            periods
        )
    elif model_name == "Prophet":
        return forecast_prophet(
            series,
            kpi_name,
            periods
        )
    else:
        raise ValueError(
            f"Unknown forecasting model: {model_name}"
        )

def forecast_all_kpis(df, kpi_columns, periods=3):

    selections = select_models_per_kpi(df, kpi_columns)

    results = []

    for kpi in kpi_columns:
        selection = selections[kpi]
        model_name = selection["model"]

        if model_name is None:
            continue

        series = df[kpi].dropna()

        #print("Forecasting: ", kpi)
        forecast= forecast_kpi(series, kpi, model_name, periods)

        results.append(forecast)

        if not results:
            raise ValueError(
                "No KPIs have enough data for forecasting."
            )

    if not results:
        return pd.DataFrame(
            columns=[
                "date",
                "forecast",
                "lower_bound",
                "upper_bound",
                "model"
            ]
    )

    return pd.concat(results, ignore_index=True)