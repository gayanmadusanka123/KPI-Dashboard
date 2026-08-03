import numpy as np
import pandas as pd
import random

def injectAnomaly(data, month):

    anomaly_type = random.choice([
        "traffic_spike",
        "traffic_drop",
        "revenue_spike",
        "delivery_failure",
        "quality_issue"
    ])

    if anomaly_type == "traffic_spike":
        data["Traffic"][month] *= 1.8

    elif anomaly_type == "traffic_drop":
        data["Traffic"][month] *= 0.5

    elif anomaly_type == "revenue_spike":
        data["Revenue"][month] *= 1.6

    elif anomaly_type == "delivery_failure":
        data["On Time Delivery"][month] -= 0.12

    elif anomaly_type == "quality_issue":
        data["Defect Rate"][month] += 0.05
        data["CSAT"][month] -= 0.08

    return anomaly_type

def generateRecords(numRecords):

    traffic = [0] * numRecords
    conversion = [0.0] * numRecords
    no_of_conversions = [0] * numRecords
    revenue = [0.0] * numRecords
    operational_cost = [0.0] * numRecords
    head_count = [0] * numRecords
    defect_rate = [0.0] * numRecords
    on_time_delivery = [0.0] * numRecords
    csat = [0.0] * numRecords
    anomaly_label = ["Normal"] * numRecords

    #current month traffic and conversion
    traffic[0] = 10000
    conversion[0] = 0.045
    defect_rate[0] = 0.05

    #initial fixed values for simulated business
    average_order_value = 100
    fixed_cost = 500000
    cost_rate = 0.15
    base_employees = 30
    revenue_per_employee = 250000
    base_delivery = 0.95
    base_csat = 0.85

    for i in range(numRecords):
        #current month 
        no_of_conversions[i] = int(traffic[i] * conversion[i])
        revenue[i] = no_of_conversions[i] * average_order_value
        operational_cost[i] = fixed_cost + cost_rate * revenue[i]
        head_count[i] = int(base_employees + revenue[i]/revenue_per_employee)
        on_time_delivery[i] = base_delivery - 0.015 * defect_rate[i] + np.random.uniform(-0.01, 0.01)
        csat[i] = base_csat + 0.002 * (on_time_delivery[i] - 0.95 ) - 0.015 * defect_rate[i] + np.random.uniform(-0.01, 0.01)

        #Generating next month
        if i < numRecords - 1:

            growth = random.uniform(-0.05 ,0.05)
            seasonality = np.random.randint(-300, 1200)
            traffic_noise = np.random.randint(-200, 200)
            conversion_noise = np.random.uniform(-0.001, 0.001)
            defect_noise = np.random.uniform(-0.003, 0.003)

            traffic[i + 1] = max(0, traffic[i] * (1 + growth) + seasonality + traffic_noise)
            conversion[i + 1] = np.clip(
                conversion[i] + conversion_noise,
                0.01,
                0.20
            )

            defect_rate[i + 1] = defect_rate[i] - 0.001 + defect_noise


    data_dict = {
        'Traffic': np.round(traffic, 2),
        'Conversion': np.round(conversion, 3),
        'No of Conversions': no_of_conversions,
        'Revenue': revenue,
        'Operational Cost': operational_cost,
        'Head Count': head_count,
        'Defect Rate': np.round(defect_rate, 2),
        'On Time Delivery': np.round(on_time_delivery, 2),
        'CSAT': np.round(csat, 2),
        'Anomaly': anomaly_label
    }

    for i in range(numRecords):
        if random.random() < 0.08:
            anomaly_label[i] = injectAnomaly(data_dict, i)

    return pd.DataFrame(data_dict)

df = generateRecords(12) 
print(df)