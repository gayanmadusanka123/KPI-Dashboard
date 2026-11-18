import numpy as np

def calculate_status(performance_score, thresholds):

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

def add_status_badges(performance_df, kpi_config):

    performance_df = performance_df.copy()

    statuses = []

    for _, row in performance_df.iterrows():

        kpi_name = row["KPI"]
        score = row["Performance Score"]

        thresholds = kpi_config[kpi_name]["thresholds"]

        statuses.append(calculate_status(score, thresholds))

    performance_df["Status"] = statuses

    return performance_df

