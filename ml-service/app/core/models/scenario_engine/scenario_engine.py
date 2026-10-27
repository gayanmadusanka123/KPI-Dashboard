from __future__ import annotations

from collections.abc import Iterable

import numpy as np
import pandas as pd


DEFAULT_HIGHER_IS_BETTER = {
    "Traffic",
    "Conversion",
    "No of Conversions",
    "Revenue",
    "On Time Delivery",
    "CSAT"
}

DEFAULT_LOWER_IS_BETTER = {
    "Operational Cost",
    "Defect Rate"
}


# return a finite float or none for missing numeric value
def _finite_numbers(value: object) -> float | None:
    if value is None:
        return None

    try:
        number = float(value)
    except(TypeError, ValueError):
        return None
    return number if np.isfinite(number) else None


# get the values from the table for lower and upper bound and return it with the forcast
def _get_model_interval_width(row: pd.Series) -> float | None:
    lower = None
    upper = None

    for name in ("lower_bound", " lower bound"):
        if name in row.index:
            lower = _finite_numbers(row[name])
            if lower is not None:
                break

    for name in ("upper_bound", " upper bound"):
        if name in row.index:
            upper = _finite_numbers(row[name])
            if upper is not None:
                break
    if lower is None or upper is None or upper < lower:
        return None

    forcast = _finite_numbers(row.get("forcast"))
    if forcast is None:
        return (upper - lower) / 2.0

    return max(forcast - lower, upper - forcast, 0.0)


def _historical_volatility_width(
        historical_series: pd.Series,
        horizon: int,
        z_score: float,
) -> float | None:
   values = pd.to_numeric(historical_series,errors='coerce').dropna()
   if len(values) < 3:
        return None

   changes = values.diff().dropna()
   volatility  = _finite_numbers(changes.std(ddof=1))

   if volatility is None:
       return None

   return max(z_score * volatility * np.sqrt(horizon), 0.0)

def _resolve_direction(
        kpi : str,
        higher_is_better : set[str],
        lower_is_better : set[str],
        direction_map : dict[str, str] | None

) -> bool:
    if direction_map and kpi in direction_map:
        direction = direction_map[kpi].strip().lower()
        if direction in {"higher","higher_is_better","up"}:
            return True
        if direction in {"lower","lower_is_better","down"}:
            return False

        raise ValueError(
            f"Invalid direction for kpi '{kpi}' : "
            f"{direction_map[kpi]!r}. Use 'higher' or 'lower' "
        )

    if kpi in higher_is_better:
        return True

    if kpi in lower_is_better:
        return False

    raise ValueError(
        f"Direction is not configured for KPI '{kpi}'. Add it to "
        "higher_is_better/lower_is_better or pass direction_map."
    )

def generate_scenario(
        forecasts :pd.DataFrame,
        historical_df : pd.DataFrame,
        *,
        higher_is_better : Iterable[str]  = DEFAULT_HIGHER_IS_BETTER,
        lower_is_better : Iterable[str] = DEFAULT_LOWER_IS_BETTER,
        direction_map : dict[str, str] | None = None,
        z_score :float = 1.282,
        volatility_multiplier: float = 1.0,
        minimum_relative_width : float = 0.0
    ) -> pd.DataFrame:
    required_columns = {"kpi","model","date","forecast"}

    missing_columns = required_columns.difference(forecasts.columns)
    if missing_columns:
        raise ValueError(
            f"Forecast Dataframe is missing required columns "
            f"{sorted(missing_columns)}"
        )

    if z_score <= 0:
        raise ValueError("z_score must be greater than 0")
    if volatility_multiplier < 0 :
        raise ValueError("volatility_multiplier cannot be negative")

    if minimum_relative_width < 0 :
        raise ValueError("minimum_relative_width cannot be negative")

    output_columns = [
        "kpi",
        "model",
        "date",
        "horizon",
        "scenario",
        "forecast",
        "uncertainty_width"

    ]

    if forecasts.empty:
        return pd.DataFrame(columns=output_columns)

    if not isinstance(historical_df,pd.DataFrame):
        raise TypeError("historical_df must be a pd.DataFrame")

    forecast_df = forecasts.copy()
    forecast_df["date"] = pd.to_datetime(forecast_df["date"],errors="raise")

    forecast_df["forecast"] = pd.to_numeric(forecast_df["forecast"],errors="raise")

    higher_set = set(higher_is_better)
    lower_set = set(lower_is_better)

    overlapping = higher_set.intersection(lower_set)

    if overlapping:
        raise ValueError(
            "KPis cannot be both higher and lower "
            f"{sorted(overlapping)}"
        )

    results : list[dict] = []

    for (kpi, model), group in forecast_df.groupby(
            ["kpi", "model"], sort=False, dropna=False
    ):
        # Check whether the KPI exists in historical data
        if kpi not in historical_df.columns:
            raise ValueError(
                f"Historical KPI '{kpi}' not found in historical_df"
            )

        higher_is_better_flag = _resolve_direction(
            str(kpi),
            higher_set,
            lower_set,
            direction_map
        )

        historical_series = historical_df[kpi]

        group = group.sort_values("date")
        widths: list[float] = []

        for horizon, (_, row) in enumerate(group.iterrows(), start=1):
            forecast_value = float(row["forecast"])

            model_width = _get_model_interval_width(row)
            volatility_width = _historical_volatility_width(
                historical_series, horizon, z_score
            )

            candidates = []

            if model_width is not None and np.isfinite(model_width):
                candidates.append(model_width)

            if volatility_width is not None and np.isfinite(volatility_width):
                candidates.append(
                    volatility_width * volatility_multiplier
                )

            width = max(candidates, default=0.0)

            width = max(
                width,
                abs(forecast_value) * minimum_relative_width,
            )

            widths.append(width)

        widths = np.maximum.accumulate(widths).tolist()

        for horizon, ((_, row), width) in enumerate(
                zip(group.iterrows(), widths), start=1
        ):
            average = float(row["forecast"])

            if higher_is_better_flag:
                best = average + width
                worst = average - width
            else:
                best = average - width
                worst = average + width

            common = {
                "kpi": kpi,
                "model": model,
                "date": row["date"],
                "horizon": horizon,
                "uncertainty_width": width,
            }

            results.extend(
                [
                    {**common, "scenario": "Best Case", "forecast": best},
                    {
                        **common,
                        "scenario": "Average Case",
                        "forecast": average,
                    },
                    {**common, "scenario": "Worst Case", "forecast": worst},
                ]
            )

    return pd.DataFrame(results, columns=output_columns)


