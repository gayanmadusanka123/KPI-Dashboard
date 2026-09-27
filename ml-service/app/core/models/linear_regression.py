import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def forecast_linear_regression(series, kpi_name, periods=3):
    series = series.dropna()

    if len(series) < 6:
        raise ValueError(
            "Linear Regression requires at least 6 data points."
        )
    
    #Time index
    X = np.arange(len(series)).reshape(-1, 1)

    #KPI values
    y = series.values

    #create model
    model = LinearRegression()

    model.fit(X, y)

    future_X = np.arange(
        len(series),
        len(series) + periods
    ).reshape(-1, 1)

    predictions = model.predict(future_X)

    last_date = series.index[-1]

    future_dates = pd.date_range(
        start=last_date + pd.offsets.MonthBegin(1),
        periods=periods,
        freq="MS"
    )

    forecast = pd.DataFrame({
        "kpi": kpi_name,
        "model": "Linear Regression",
        "date": future_dates,
        "forecast": predictions
    })

    return forecast