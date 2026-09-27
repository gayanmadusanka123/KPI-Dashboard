import sys
import os
import pandas as pd

current_dir = os.path.dirname(os.path.abspath(__file__))
synthetic_folder_path = os.path.join(current_dir, "synthetic")
preprocessing_folder_path = os.path.join(current_dir, "app", "core")
if preprocessing_folder_path not in sys.path:
    sys.path.append(preprocessing_folder_path)

sys.path.append(synthetic_folder_path)

from synthetic_generator import generateRecords
from preprocessing import clean_time_series, normalize_data

df = generateRecords(12)
df['date'] = pd.date_range(start='2025-01-01', periods=12, freq='MS')

print("Original data:")
print(df)

#clean generated data
cleaned_df = clean_time_series(df)
normalize_df, scaler = normalize_data(cleaned_df)
print("\nCleaned data:")
print(cleaned_df)

#print(cleaned_df.columns.tolist())
#print(cleaned_df.isna().sum())
#print(cleaned_df.isna().sum()[cleaned_df.isna().sum() > 0])

print("\nFinal preprocessed data")
print(cleaned_df)

print("\nNormalized data")
print(normalize_df)