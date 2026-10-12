def select_model(data_points):

    if data_points < 6:
        return {
            "model": None,
            "tier": "insufficient_data"
        }

    elif data_points <= 11:
        return {
            "model": "Linear Regression",
            "tier": "6-11"
        }

    elif data_points <= 23:
        return {
            "model": "Exponential Smoothing",
            "tier": "12-23"
        }

    elif data_points <= 47:
        return {
            "model": "SARIMA",
            "tier": "24-47"
        }

    else:
        return {
            "model": "Prophet",
            "tier": "48+"
        }

def select_models_per_kpi(df, kpi_columns):
    selections = {}

    for kpi in kpi_columns:
        series = df[kpi].dropna() #calculating the no of data points
        data_points = len(series)

        selections[kpi] = {
            "data_points": data_points,
            **select_model(data_points)
        }

    return selections