import pandas as pd
import pytest

from models.scenario_engine.scenario_engine import generate_scenarios


@pytest.fixture
def historical():
    dates = pd.date_range("2024-01-01", periods=12, freq="MS")
    return pd.DataFrame(
        {
            "Revenue": [100, 110, 108, 120, 125, 123, 130, 138, 140, 145, 150, 155],
            "Operational Cost": [80, 78, 82, 77, 75, 74, 72, 73, 70, 69, 68, 67],
        },
        index=dates,
    )


def test_generates_three_scenarios_per_forecast(historical):
    forecasts = pd.DataFrame(
        {
            "kpi": ["Revenue", "Revenue"],
            "model": ["SARIMA", "SARIMA"],
            "date": pd.to_datetime(["2025-01-01", "2025-02-01"]),
            "forecast": [160.0, 165.0],
            "lower_bound": [150.0, 152.0],
            "upper_bound": [170.0, 178.0],
        }
    )

    result = generate_scenarios(forecasts, historical)

    assert len(result) == 6
    assert result.groupby(["kpi", "date"]).size().eq(3).all()


def test_higher_is_better_direction(historical):
    forecasts = pd.DataFrame(
        {
            "kpi": ["Revenue"],
            "model": ["Linear Regression"],
            "date": pd.to_datetime(["2025-01-01"]),
            "forecast": [160.0],
        }
    )

    result = generate_scenarios(forecasts, historical)
    values = result.set_index("scenario")["forecast"]

    assert values["Best Case"] > values["Average Case"]
    assert values["Worst Case"] < values["Average Case"]


def test_lower_is_better_direction(historical):
    forecasts = pd.DataFrame(
        {
            "kpi": ["Operational Cost"],
            "model": ["Exponential Smoothing"],
            "date": pd.to_datetime(["2025-01-01"]),
            "forecast": [65.0],
        }
    )

    result = generate_scenarios(forecasts, historical)
    values = result.set_index("scenario")["forecast"]

    assert values["Best Case"] < values["Average Case"]
    assert values["Worst Case"] > values["Average Case"]


def test_uncertainty_cone_does_not_shrink(historical):
    forecasts = pd.DataFrame(
        {
            "kpi": ["Revenue"] * 3,
            "model": ["SARIMA"] * 3,
            "date": pd.to_datetime(
                ["2025-01-01", "2025-02-01", "2025-03-01"]
            ),
            "forecast": [160.0, 165.0, 170.0],
            # Deliberately shrinking intervals; engine should enforce cone.
            "lower_bound": [150.0, 160.0, 168.0],
            "upper_bound": [170.0, 170.0, 172.0],
        }
    )

    result = generate_scenarios(forecasts, historical)
    widths = (
        result[result["scenario"] == "Best Case"]
        .sort_values("horizon")["uncertainty_width"]
        .to_numpy()
    )

    assert (widths[1:] >= widths[:-1]).all()


def test_unknown_kpi_direction_requires_configuration(historical):
    forecasts = pd.DataFrame(
        {
            "kpi": ["Unknown KPI"],
            "model": ["SARIMA"],
            "date": pd.to_datetime(["2025-01-01"]),
            "forecast": [10.0],
        }
    )
    unknown_history = historical.assign(**{"Unknown KPI": 1.0})

    with pytest.raises(ValueError, match="Direction is not configured"):
        generate_scenarios(forecasts, unknown_history)
