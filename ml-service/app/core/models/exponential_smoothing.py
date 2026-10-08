import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def forecast_exponential_smoothing(
        series, 
        kpi_name, 
        periods=3,
        trend="add",
        seasonal=None,
        seasonal_periods=None,
        damped_trend=True
    ):

    series = series.dropna()

    if len(series) < 12:
        raise ValueError("Exponential Smoothing requires at least 12 data points.")

    #validating seasonal configuration
    if seasonal is not None:
        if seasonal_periods is None:
            raise ValueError(
                "seasonal_periods must be provided "
                "when seasonality is enabled."
            )

        if len(series) < 2 * seasonal_periods:
            raise ValueError(
                f"At least {2 * seasonal_periods} data points "
                f"are required for seasonal period "
                f"{seasonal_periods}."
            )

    model = ExponentialSmoothing(
        series,
        trend=trend,
        seasonal=seasonal,
        seasonal_periods=seasonal_periods,
        damped_trend=damped_trend
    )

    fitted_model = model.fit()

    predictions = fitted_model.forecast(periods)

    future_dates = pd.date_range(
        start=series.index[-1] + pd.offsets.MonthBegin(1),
        periods=periods,
        freq="MS"
    )

    forecast = pd.DataFrame({
        "kpi": kpi_name,
        "model": "Exponential Smoothing",
        "date": future_dates,
        "forecast": predictions.values
    })

    return forecast