# to run the celery
# celery -A celery_app:celery_app worker --loglevel=INFO --pool=solo
import os
import sys
import pandas as pd
from celery_app import celery_app

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sys.path.insert(0, os.path.join(BASE_DIR, "synthetic"))
sys.path.insert(0, os.path.join(BASE_DIR, "app", "core"))

from synthetic.synthetic_generator import generateRecords
from app.core.preprocessing import clean_time_series
from app.core.forecasting import forecast_all_kpis

SYNTHETIC_KPI_COLUMNS = [
    'Traffic',
    'Conversion',
    'No of Conversions',
    'Revenue',
    'Operational Cost',
    'Head Count',
    'Defect Rate',
    'On Time Delivery',
    'CSAT'
]

@celery_app.task  # can execute as bacground job by celery worker
def test_kpi_forecasting():
    no_of_months = 100

    df = generateRecords(no_of_months)

    df["date"] = pd.date_range(
        start="2025-01-01",
        periods=no_of_months,
        freq="MS"
    )

    cleaned_df = clean_time_series(
        df,
        kpi_columns=SYNTHETIC_KPI_COLUMNS
    )

    forecasts = forecast_all_kpis(
        cleaned_df,
        SYNTHETIC_KPI_COLUMNS,
        periods=3
    )

    return {
        "status": "success",
        "kpis_forecasted": forecasts["kpi"].unique().tolist(),
        "forecast_rows": len(forecasts)
    }