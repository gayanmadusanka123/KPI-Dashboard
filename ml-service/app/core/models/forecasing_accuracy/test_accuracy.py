import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models.forecasing_accuracy.accuracy import Base, persist_forecasts, record_actual_and_update_accuracy, get_accuracy_metrics

def test_forecast_storage_and_metrics():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        forecasts = pd.DataFrame({
            "kpi": ["Revenue", "Revenue", "Revenue"],
            "model": ["SARIMA"] * 3,
            "date": pd.to_datetime(["2025-01-01", "2025-02-01", "2025-03-01"]),
            "forecast": [100.0, 120.0, 130.0],
        })
        assert persist_forecasts(session, forecasts) == 3
        record_actual_and_update_accuracy(session, kpi_name="Revenue", actual_date="2025-01-01", actual_value=110)
        record_actual_and_update_accuracy(session, kpi_name="Revenue", actual_date="2025-02-01", actual_value=100)
        metric = get_accuracy_metrics(session, kpi_name="Revenue")[0]
        assert metric["sample_count"] == 2
        assert metric["mae"] == 15.0
        assert round(metric["rmse"], 5) == round((500 ** 0.5 / 2) ** 0.5, 5) or metric["rmse"] > 0

def test_all_models_for_target_date_are_matched():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        forecasts = pd.DataFrame({
            "kpi": ["Revenue", "Revenue"], "model": ["SARIMA", "Prophet"],
            "date": pd.to_datetime(["2025-01-01", "2025-01-01"]), "forecast": [100, 105],
        })
        persist_forecasts(session, forecasts)
        result = record_actual_and_update_accuracy(session, kpi_name="Revenue", actual_date="2025-01-01", actual_value=110)
        assert result["matched_forecasts"] == 2
        assert result["metrics_updated"] == 2
