import pandas as pd

df = pd.read_csv('ml-service/data/retail_sales_dataset.csv')

df["Date"] = pd.to_datetime(df["Date"])

df["Period"] = df["Date"].dt.to_period("M").astype(str)

monthly = (
    df.groupby("Period")
      .agg(
          Revenue=("Total Amount", "sum"),
          Transactions=("Transaction ID", "count"),
          Quantity=("Quantity", "sum"),
          Avg_Order_Value=("Total Amount", "mean")
      )
      .reset_index()
)

monthly["Avg_Order_Value"] = monthly["Avg_Order_Value"].round(2)

monthly["Source"] = "Kaggle Retail Sales"

print(monthly.head())