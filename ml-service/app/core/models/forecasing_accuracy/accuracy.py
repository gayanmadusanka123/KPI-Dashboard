"""Persist forecasts and calculate KPI/model accuracy metrics using SQLAlchemy 2.x."""
from datetime import date, datetime, timezone
import numpy as np
import pandas as pd
from sqlalchemy import (create_engine, select, Integer, String, Date, DateTime,
                        Float, UniqueConstraint, Index)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session, sessionmaker

class Base(DeclarativeBase):
    pass

class ForecastPrediction(Base):
    __tablename__ = "forecast_predictions"
    __table_args__ = (Index("ix_forecast_match", "kpi_name", "target_date"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    kpi_name: Mapped[str] = mapped_column(String(150), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    target_date: Mapped[date] = mapped_column(Date, nullable=False)
    predicted_value: Mapped[float] = mapped_column(Float, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    actual_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    actual_recorded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

class ForecastAccuracy(Base):
    __tablename__ = "forecast_accuracy"
    __table_args__ = (UniqueConstraint("kpi_name", "model_name", "evaluation_start", "evaluation_end", name="uq_accuracy_window"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    kpi_name: Mapped[str] = mapped_column(String(150), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    evaluation_start: Mapped[date] = mapped_column(Date, nullable=False)
    evaluation_end: Mapped[date] = mapped_column(Date, nullable=False)
    sample_count: Mapped[int] = mapped_column(Integer, nullable=False)
    mae: Mapped[float] = mapped_column(Float, nullable=False)
    mape: Mapped[float | None] = mapped_column(Float, nullable=True)
    rmse: Mapped[float] = mapped_column(Float, nullable=False)
    directional_accuracy: Mapped[float | None] = mapped_column(Float, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

def create_session_factory(database_url: str):
    """Local bootstrap helper; use the project's migration tool in production."""
    engine = create_engine(database_url, pool_pre_ping=True)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, expire_on_commit=False)

def _as_date(value):
    return pd.Timestamp(value).date()

def persist_forecasts(session: Session, forecasts: pd.DataFrame) -> int:
    """Persist base-model forecasts; expected columns: kpi, model, date, forecast."""
    required = {"kpi", "model", "date", "forecast"}
    missing = required - set(forecasts.columns)
    if missing:
        raise ValueError(f"Forecast DataFrame missing columns: {sorted(missing)}")
    if forecasts.empty:
        return 0
    now = datetime.now(timezone.utc)
    rows = []
    for row in forecasts.to_dict(orient="records"):
        value = float(row["forecast"])
        if not np.isfinite(value):
            raise ValueError("Forecast values must be finite.")
        rows.append(ForecastPrediction(
            kpi_name=str(row["kpi"]), model_name=str(row["model"]),
            target_date=_as_date(row["date"]), predicted_value=value,
            generated_at=now))
    session.add_all(rows)
    session.commit()
    return len(rows)

def _metrics(predictions, actual_by_date):
    actual = np.array([p.actual_value for p in predictions], dtype=float)
    predicted = np.array([p.predicted_value for p in predictions], dtype=float)
    errors = predicted - actual
    nonzero = actual != 0
    mape = float(np.mean(np.abs(errors[nonzero] / actual[nonzero])) * 100) if nonzero.any() else None
    direction = []
    for p in predictions:
        baseline = actual_by_date.get(p.target_date)
        if baseline is not None:
            pred_delta = p.predicted_value - baseline
            actual_delta = p.actual_value - baseline
            direction.append((pred_delta >= 0 and actual_delta >= 0) or (pred_delta < 0 and actual_delta < 0))
    return {
        "sample_count": len(predictions),
        "mae": float(np.mean(np.abs(errors))),
        "mape": mape,
        "rmse": float(np.sqrt(np.mean(errors ** 2))),
        "directional_accuracy": float(np.mean(direction) * 100) if direction else None,
    }

def record_actual_and_update_accuracy(session: Session, *, kpi_name: str, actual_date, actual_value: float):
    """Match a logged actual to all forecasts for that KPI/date and refresh metrics."""
    value = float(actual_value)
    if not np.isfinite(value):
        raise ValueError("actual_value must be finite.")
    target = _as_date(actual_date)
    now = datetime.now(timezone.utc)
    matches = list(session.scalars(select(ForecastPrediction).where(
        ForecastPrediction.kpi_name == kpi_name,
        ForecastPrediction.target_date == target)).all())
    if not matches:
        return {"kpi": kpi_name, "actual_date": target.isoformat(), "matched_forecasts": 0, "metrics_updated": 0}
    for p in matches:
        p.actual_value = value
        p.actual_recorded_at = now
    session.flush()

    # One actual per target date, independent of how many models forecast it.
    actual_rows = list(session.scalars(select(ForecastPrediction).where(
        ForecastPrediction.kpi_name == kpi_name,
        ForecastPrediction.actual_value.is_not(None)).order_by(ForecastPrediction.target_date)).all())
    actual_by_date = {}
    for p in actual_rows:
        actual_by_date.setdefault(p.target_date, float(p.actual_value))
    ordered_dates = sorted(actual_by_date)
    previous_actual = {ordered_dates[i]: actual_by_date[ordered_dates[i-1]]
                       for i in range(1, len(ordered_dates))}

    updated = []
    for model in sorted({p.model_name for p in matches}):
        scored = list(session.scalars(select(ForecastPrediction).where(
            ForecastPrediction.kpi_name == kpi_name,
            ForecastPrediction.model_name == model,
            ForecastPrediction.actual_value.is_not(None)).order_by(ForecastPrediction.target_date)).all())
        metrics = _metrics(scored, previous_actual)
        start, end = min(p.target_date for p in scored), max(p.target_date for p in scored)
        saved = session.scalar(select(ForecastAccuracy).where(
            ForecastAccuracy.kpi_name == kpi_name,
            ForecastAccuracy.model_name == model,
            ForecastAccuracy.evaluation_start == start,
            ForecastAccuracy.evaluation_end == end))
        if saved is None:
            saved = ForecastAccuracy(kpi_name=kpi_name, model_name=model,
                evaluation_start=start, evaluation_end=end, **metrics)
            session.add(saved)
        else:
            for key, metric in metrics.items():
                setattr(saved, key, metric)
            saved.updated_at = now
        updated.append({"kpi": kpi_name, "model": model, "evaluation_start": start.isoformat(),
                        "evaluation_end": end.isoformat(), **metrics})
    session.commit()
    return {"kpi": kpi_name, "actual_date": target.isoformat(),
            "matched_forecasts": len(matches), "metrics_updated": len(updated), "metrics": updated}

def get_accuracy_metrics(session: Session, *, kpi_name=None, model_name=None):
    query = select(ForecastAccuracy)
    if kpi_name is not None:
        query = query.where(ForecastAccuracy.kpi_name == kpi_name)
    if model_name is not None:
        query = query.where(ForecastAccuracy.model_name == model_name)
    rows = session.scalars(query.order_by(ForecastAccuracy.kpi_name, ForecastAccuracy.model_name,
                                          ForecastAccuracy.evaluation_end.desc())).all()
    return [{"kpi": r.kpi_name, "model": r.model_name,
             "evaluation_start": r.evaluation_start.isoformat(), "evaluation_end": r.evaluation_end.isoformat(),
             "sample_count": r.sample_count, "mae": r.mae, "mape": r.mape, "rmse": r.rmse,
             "directional_accuracy": r.directional_accuracy, "updated_at": r.updated_at.isoformat()}
            for r in rows]
