
import pandas as pd

from app.core.performance.performance_calculator import (
    calculate_kpi_performance
)

config = {
    "direction": "LOWER_BETTER",
    "target": 50000
}

data = pd.DataFrame({
    "Operational Cost": [
        60000,
        55000,
        50000,
        45000,
        40000,
        35000
    ]
}, index=pd.date_range(
    "2026-01-01",
    periods=6,
    freq="MS"
))

result = calculate_kpi_performance(
    data,
    "Operational Cost",
    config
)

print(result.to_string(index=False))
