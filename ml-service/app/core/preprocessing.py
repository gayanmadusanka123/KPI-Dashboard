import pandas as pd
from sklearn.preprocessing import MinMaxScaler

HIGHER_IS_BETTER = [
    'Traffic',
    'Conversion',
    'No of Conversions',
    'Revenue',
    'On Time Delivery',
    'CSAT' 
]

LOWER_IS_BETTER = [
    'Operational Cost',
    'Defect Rate'
]

def clean_time_series(df, kpi_columns, date_column="date"):
    df[date_column] = pd.to_datetime(df[date_column])
    df = df.sort_values(date_column)
    df = df.set_index(date_column)
    df = df.resample("MS").mean(numeric_only=True)
    df = df.interpolate(
        method="linear",
        limit_area="inside"
    )

    df = df.ffill().bfill()

    df = handle_outliers_iqr(df, kpi_columns)
    df = create_features(df, kpi_columns)

    return df

def handle_outliers_iqr(df, kpi_columns):
    df = df.copy()

    for column in kpi_columns:
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)

        IQR = Q3 - Q1
        
        #bounds
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        #Winsorization: cap extreme values
        df[column] = df[column].clip(
            lower = lower_bound,
            upper = upper_bound
        )

    return df

def create_features(df, kpi_columns):
    df = df.copy()

    df['period_index'] = range(len(df))
    df['month'] = df.index.month
    df['quarter'] = df.index.quarter

    for column in kpi_columns:
        df[f'{column}_L1'] = df[column].shift(1)
        df[f'{column}_L2'] = df[column].shift(2)
        df[f'{column}_L3'] = df[column].shift(3)

        #rolling for months
        df[f'{column}_rolling_mean'] = (
            df[column].rolling(window=3).mean()
        )

        #rolling months standard deviation
        df[f'{column}_rolling_std'] = (
            df[column].rolling(window=3).std()
        )

        #PoP percentage - compare with previous month
        df[f'{column}_PoP'] = df[column].pct_change()

    return df

def normalize_data(df, kpi_columns):
    df = df.copy()

    scaler = MinMaxScaler()

    df[kpi_columns] = scaler.fit_transform(
        df[kpi_columns]
    )

    return df, scaler

def calculate_performance_score(df):
    df = df.copy()

    scores = []

    for column in HIGHER_IS_BETTER:
        scores.append(df[column])

    for column in LOWER_IS_BETTER:
        scores.append(1 - df[column])

    df['Performance Score'] = pd.concat(
        scores,
        axis=1
    ).mean(axis=1)

    return df