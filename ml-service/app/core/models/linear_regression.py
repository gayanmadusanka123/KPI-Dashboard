import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def forecast_linear_regression(series, kpi_name, periods=3, confidence=0.80):
    series = series.dropna()

    if len(series) < 6:
        raise ValueError(
            "Linear Regression requires at least 6 data points."
        )
    
    #Time index
    X = np.arange(len(series)).reshape(-1, 1)

    #KPI values
    y = series.values.astype(float)

    #create model
    model = LinearRegression()
    model.fit(X, y)

    future_X = np.arange(
        len(series),
        len(series) + periods
    ).reshape(-1, 1)

    predictions = model.predict(future_X)

    #residuals and confidence intervals

    fitted_values = model.predict(X)
    residuals = y - fitted_values
    residual_std = np.std(
        residuals,
        ddof=1
    )

    #confidence intervals
    if confidence == 0.80:
        z_score = 1.282
    elif confidence == 0.90:
        z_score = 1.645
    elif confidence == 0.95:
        z_score = 1.960
    else:
        raise ValueError(
            "Supported confidence levels : 0.80, 0.90, 0.95"
        )

    margin = z_score * residual_std

    lower_bound = predictions - margin
    upper_bound = predictions + margin
    
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
        "forecast": predictions,
        "lower_bound": lower_bound,
        "upper_bound": upper_bound
    })

    return forecast