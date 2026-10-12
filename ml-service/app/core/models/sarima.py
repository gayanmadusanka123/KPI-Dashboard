import itertools
import warnings

import numpy as np
import pandas as pd

from statsmodels.tsa.statespace.sarimax import SARIMAX

def generate_parameter_grid():

    p_values = [0, 1]
    d_values = [0, 1]
    q_values = [0, 1]

    P_values = [0, 1]
    D_values = [0, 1]
    Q_values = [0, 1]

    seasonal_period = 12

    pdq = list(
        itertools.product(
            p_values,
            d_values,
            q_values
        )
    )

    seasonal_pdq = list(
        itertools.product(
            P_values,
            D_values,
            Q_values
        )
    )

    return pdq, seasonal_pdq

def find_best_sarima_model(series):
    pdq, seasonal_pdq = generate_parameter_grid()

    best_aic = float("inf")
    best_order = None
    best_seasonal_order = None
    best_model = None

    for order in pdq:
        for seasonal in seasonal_pdq:
            seasonal_order = (
                seasonal[0],
                seasonal[1],
                seasonal[2],
                12
            )

            try:
                model = SARIMAX(
                    series,
                    order=order,
                    seasonal_order=seasonal_order,
                    enforce_stationarity=False,
                    enforce_invertibility=False
                )

                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")

                    fitted_model = model.fit(disp=False)

                if fitted_model.aic < best_aic:
                    best_aic = fitted_model.aic
                    best_order = order
                    best_seasonal_order = seasonal_order
                    best_model = fitted_model

            except Exception:
                continue

    if best_model is None:
        raise ValueError(
            "Could not find a suitable SARIMA model."
        )

    return (
        best_model,
        best_order,
        best_seasonal_order,
        best_aic
    )

def forecast_sarima(series,kpi_name,periods=3):
    series = series.dropna()

    if len(series) < 24:
        raise ValueError(
            "SARIMA requires at least 24 data points."
        )

    best_model, best_order, best_seasonal_order, best_aic = (
        find_best_sarima_model(series)
    )

    forecast_result = best_model.get_forecast(
        steps=periods
    )

    predictions = forecast_result.predicted_mean

    confidence_interval = forecast_result.conf_int(alpha=0.20)

    future_dates = pd.date_range(
        start=series.index[-1] + pd.offsets.MonthBegin(1),
        periods=periods,
        freq="MS"
    )

    forecast = pd.DataFrame({
        "kpi": kpi_name,
        "model": "SARIMA",
        "date": future_dates,
        "forecast": predictions.values,
        "lower_bound": confidence_interval.iloc[:, 0].values,
        "upper_bound": confidence_interval.iloc[:, 1].values
    })

    return forecast

