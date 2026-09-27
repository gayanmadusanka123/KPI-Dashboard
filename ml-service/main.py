import sys
import os
import pandas as pd

current_dir = os.path.dirname(os.path.abspath(__file__))
synthetic_folder_path = os.path.join(current_dir, "synthetic")
preprocessing_folder_path = os.path.join(current_dir, "app", "core")
modelselector_folder_path = os.path.join(current_dir, "app", "core")
linearregression_folder_path = os.path.join(current_dir, "app", "core", "models")

if preprocessing_folder_path not in sys.path:
    sys.path.append(preprocessing_folder_path)

if modelselector_folder_path not in sys.path:
    sys.path.append(modelselector_folder_path)

if linearregression_folder_path not in sys.path:
    sys.path.append(linearregression_folder_path)

sys.path.append(synthetic_folder_path)

from synthetic_generator import generateRecords
from preprocessing import clean_time_series, normalize_data, calculate_performance_score
from model_selector import select_model, select_models_per_kpi
from linear_regression import forecast_linear_regression

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

no_of_months = 8
df = generateRecords(no_of_months)
df['date'] = pd.date_range(start='2025-01-01', periods=no_of_months, freq='MS')

print("Original data:")
print(df)

#clean generated data
cleaned_df = clean_time_series(df, kpi_columns=SYNTHETIC_KPI_COLUMNS)
normalize_df, scaler = normalize_data(cleaned_df, kpi_columns=SYNTHETIC_KPI_COLUMNS)
performance_df = calculate_performance_score(normalize_df)

print("\nCleaned data:")
print(cleaned_df)

#print(cleaned_df.columns.tolist())
#print(cleaned_df.isna().sum())
#print(cleaned_df.isna().sum()[cleaned_df.isna().sum() > 0])

print("\nFinal preprocessed data")
print(cleaned_df)

print("\nNormalized data")
print(normalize_df)

print("\nPerformance Score")
print(performance_df[['Performance Score']])

print("\nModel selection Tests")
for points in [4, 8, 12, 18, 24, 36, 48, 60]:
    result = select_model(points)

    print(
        f"{points} data points -> "
        f"{result['model']}"
        f"({result['tier']})"
    )

print("\nModel selections for KPI columns")

selections = select_models_per_kpi(cleaned_df, kpi_columns=SYNTHETIC_KPI_COLUMNS)

for kpi, result in selections.items():
    print(
        f"{kpi}: "
        f"{result['data_points']} points -> "
        f"{result['model']}"
    )

print("\nRevenue Forecast")

revenue_forecast = forecast_linear_regression(
    cleaned_df['Revenue'],
    kpi_name = 'Revenue',
    periods = 3
)
print(revenue_forecast)