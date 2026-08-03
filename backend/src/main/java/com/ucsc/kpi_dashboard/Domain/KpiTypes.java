package com.ucsc.kpi_dashboard.Domain;

public enum KpiTypes {
    MONTHLY_REVENUE,
    CSAT_SCORE,
    HEAD_COUNT,
    DEFECT_RATE,
    SALES_CONVERSION,
    OPERATIONAL_COST,
    WEBSITE_TRAFFIC,
    ON_TIME_DELIVERY;

    public static KpiTypes from(String value){
        return KpiTypes.valueOf(value.trim().toUpperCase());
    }
}
