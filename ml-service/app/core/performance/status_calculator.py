import numpy as np

def calculate_status(performance_score, thresholds):

    if performance_score is None:
        return "Insufficient Data"

    if not np.isfinite(performance_score):
        return "Insufficient Data"

    exceeded = thresholds["exceeded"] * 100
    on_track = thresholds["on_track"] * 100
    at_risk = thresholds["at_risk"] * 100

    if performance_score >= exceeded:
        return "Exceeded"

    elif performance_score >= on_track:
        return "On Track"

    elif performance_score >= at_risk:
        return "At Risk"

    return "Off Track"

def add_status_badges(performance_df, thresholds):

    performance_df = performance_df.copy()

    performance_df["Status"] = performance_df[
        "Performance Score"
    ].apply(
        lambda score: calculate_status(
            score,
            thresholds
        )
    )

    return performance_df


