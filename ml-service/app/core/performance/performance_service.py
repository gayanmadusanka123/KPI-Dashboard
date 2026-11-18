from app.core.performance.kpi_config import KPI_CONFIG

from app.core.performance.performance_calculator import(
    calculate_all_kpi_performance
)

from app.core.performance.status_calculator import(
    add_status_badges
)

from app.core.performance.trend_calculator import(
    add_trend_direction
)

def run_performance_engine(df):

    performance_df = calculate_all_kpi_performance(
        df,
        KPI_CONFIG,
        rolling_window=3
    )

    performance_df = add_status_badges(
        performance_df,
        KPI_CONFIG
    )

    performance_df = add_trend_direction(
        performance_df,
        n=3,
        stability_threshold=2
    )

    return performance_df

