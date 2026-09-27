import pandas as pd
from sklearn.preprocessing import MinMaxScaler

KPI_COLUMNS = [
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

NORMALIZE_COLUMNS = KPI_COLUMNS

def clean_time_series(df, date_column="date"):
    df[date_column] = pd.to_datetime(df[date_column])
    df = df.sort_values(date_column)
    df = df.set_index(date_column)
    df = df.resample("MS").mean(numeric_only=True)
    df = df.interpolate(
        method="linear",
        limit_area="inside"
    )

    df = df.ffill().bfill()

    df = handle_outliers_iqr(df)
    df = create_features(df)

    return df

def handle_outliers_iqr(df):
    df = df.copy()

    for column in KPI_COLUMNS:
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

def create_features(df):
    df = df.copy()

    df['period_index'] = range(len(df))
    df['month'] = df.index.month
    df['quarter'] = df.index.quarter

    for column in KPI_COLUMNS:
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

    df = df.dropna()
    return df

def normalize_data(df):
    df = df.copy()

    scaler = MinMaxScaler()

    df[NORMALIZE_COLUMNS] = scaler.fit_transform(
        df[NORMALIZE_COLUMNS]
    )

    return df, scaler
