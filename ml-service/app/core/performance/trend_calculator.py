def calculate_trend(
        scores,
        n=3,
        stability_threshold=2
):
    if len(scores) < n * 2:
        return "Insufficient Data"

    recent_average = scores.iloc[-n:].mean()

    previous_average = (
        scores.iloc[-(n * 2):-n].mean()
    )

    difference = recent_average - previous_average

    if difference > stability_threshold:
        return "Improving"

    elif difference < -stability_threshold:
        return "Declining"

    return "Stable"

def add_trend_direction(
        performance_df,
        n=3,
        stability_threshold=2
):
    performance_df = performance_df.copy()

    performance_df = performance_df.sort_values(
        ["KPI", "Date"]
    )

    performance_df["Trend Direction"] = "Insufficient Data"

    for kpi_name, group in performance_df.groupby("KPI"):

        scores = group["Performance Score"].reset_index(drop=True)
        trends = []

        for i in range(len(scores)):
            historical_scores = scores.iloc[:i + 1]

            trend = calculate_trend(
                historical_scores,
                n=n,
                stability_threshold=stability_threshold
            )

            trends.append(trend)

        performance_df.loc[
            group.index,
            "Trend Direction"
        ] = trends

    return performance_df




