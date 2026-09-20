package com.ucsc.kpi_dashboard.Payload.Dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class KpiPeriodDataDto {

    private Long id;

    private Long kpiId;

    private LocalDate period;

    private Double targetValue;

    private Double actualValue;

    private Double performanceScore;

    private Double variance;

    private Double variancePercentage;

    private String performanceStatus;

    private String notes;

    private String confidenceLevel;

    private UUID enteredBy;

    private LocalDateTime entryDate;
}