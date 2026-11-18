import pandas as pd
import pytest

from app.core.performance.performance_calculator import (
    calculate_kpi_performance
)

from app.core.performance.status_calculator import (
    calculate_status
)

from app.core.performance.trend_calculator import (
    calculate_trend
)

def test_higher_is_better_performance():
    data = pd.DataFrame({
        "Revenue": [80000, 100000, 120000]
    })

    config = {
        "direction": "HIGHER_BETTER",
        "target": 100000
    }

    result = calculate_kpi_performance(
        data,
        "Revenue",
        config
    )

    assert result["Performance Score"].tolist() == [
        80,
        100,
        120
    ]

    assert result["Variance"].tolist() == [
        -20000,
        0,
        20000
    ]

def test_lower_is_better_performance():

    data = pd.DataFrame({
        "Operational Cost": [60000, 50000, 40000]
    })

    config = {
        "direction": "LOWER_BETTER",
        "target": 50000
    }

    result = calculate_kpi_performance(
        data,
        "Operational Cost",
        config
    )

    assert result["Performance Score"].tolist() == pytest.approx([
        83.333333,
        100,
        125
    ])

    assert result["Variance"].tolist() == [
        -10000,
        0,
        10000
    ]

def test_invalid_target():

    data = pd.DataFrame({
        "Revenue": [80000, 90000]
    })

    config = {
        "direction": "HIGHER_BETTER",
        "target": 0
    }

    with pytest.raises(ValueError):
        calculate_kpi_performance(
            data,
            "Revenue",
            config
        )

def test_invalid_direction():
    data = pd.DataFrame({
        "Revenue": [80000, 90000]
    })

    config = {
        "direction": "UNKNOWN",
        "target": 100000
    }

    with pytest.raises(ValueError):
        calculate_kpi_performance(
            data,
            "Revenue",
            config
        )

# Status badge tests
@pytest.mark.parametrize(
    "score, expected_status",
    [
        (115, "Exceeded"),
        (100, "On Track"),
        (85, "At Risk"),
        (70, "Off Track"),
        (None, "Insufficient Data"),
        (float("nan"), "Insufficient Data")
    ]
)

def test_status_calculation(score, expected_status):

    thresholds = {
        "exceeded": 1.10,
        "on_track": 0.95,
        "at_risk": 0.80
    }

    result = calculate_status(score, thresholds)

    assert result == expected_status

def test_improving_trend():

    scores = pd.Series([
        70, 72, 75,
        90, 95, 100
    ])

    result = calculate_trend(scores)

    assert result == "Improving"

def test_declining_trend():

    scores = pd.Series([
        100, 105, 110,
        80, 75, 70
    ])

    result = calculate_trend(scores)

    assert result == "Declining"

def test_stable_trend():

    scores = pd.Series([
        90, 91, 90,
        91, 90, 92
    ])

    result = calculate_trend(scores)

    assert result == "Stable"

def test_insufficient_trend_data():

    scores = pd.Series([
        80, 85, 90
    ])

    result = calculate_trend(scores)

    assert result == "Insufficient Data"