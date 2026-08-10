import pandas as pd

train = pd.read_csv("ml-service/data/Monthly-train.csv", nrows=100)
info = pd.read_csv("ml-service/data/m4_info.csv")

info["SP"] = info["SP"].str.strip()
info = info[info["SP"] == "Monthly"]

processed_data = []

print(train.iloc[0]["V1"]) 
print(info.head())
print(info["SP"].unique())
print(info[info["M4id"] == "M1"])

for index, row in train.head(100).iterrows():
    series_id = row["V1"]

    #meta data finding
    meta = info[info["M4id"] == series_id]

    if meta.empty:
        continue

    category = meta.iloc[0]["category"]
    start_date = pd.to_datetime(meta.iloc[0]["StartingDate"])

    values = row.iloc[1:].dropna().values

    dates = pd.date_range(
        start=start_date,
        periods=len(values),
        freq="MS"
    )

    temp = pd.DataFrame({
        "Series_ID": series_id,
        "Category": category,
        "Period": dates,
        "Value": values,
        "Source": "M4 Competition"
    })

    processed_data.append(temp)

final_df = pd.concat(processed_data, ignore_index=True)

print(final_df.head())
