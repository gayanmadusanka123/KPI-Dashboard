import pandas as pd
from prophet import Prophet

def forecast_prophet(series, kpi_name, periods=3):

    series = series.dropna()
    if len(series) < 48:
        raise ValueError(
            "Prophet requires at least 48 data points."
        )

    prophet_df = pd.DataFrame({
        "ds": series.index,
        "y": series.values
    })

    prophet_df["ds"] = pd.to_datetime(
        prophet_df["ds"]
    )

    print(prophet_df.head())
    print(prophet_df.dtypes)

    model = Prophet(
        changepoint_prior_scale=0.05,
        yearly_seasonality=True,
        interval_width=0.80
    )

    #Look for repeating pattern approximately every 365/4 = 91.25 quarter
    model.add_seasonality(
        name="quarterly",
        period=91.25,
        fourier_order=3 #how complex that seasonal pattern can be
    )

    #learning
    model.fit(prophet_df)

    future = model.make_future_dataframe(
        periods=periods,
        freq="MS"
    )

    forecast = model.predict(future)
    forecast = forecast.tail(periods)

    result = pd.DataFrame({
        "kpi": kpi_name,
        "model": "Prophet",
        "date": forecast["ds"],
        "forecast": forecast["yhat"],
        "lower_bound": forecast["yhat_lower"],
        "upper_bound": forecast["yhat_upper"]
    })

    return result

