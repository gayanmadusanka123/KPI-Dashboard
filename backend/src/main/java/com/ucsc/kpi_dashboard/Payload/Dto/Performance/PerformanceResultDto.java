package com.ucsc.kpi_dashboard.Payload.Dto.Performance;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PerformanceResultDto {

    @NotNull
    private UUID periodId;

    private BigDecimal performanceScore;

    private BigDecimal variance;

    private BigDecimal variancePercent;

    private BigDecimal periodChangePercent;

    private String trendDirection;

    private BigDecimal rollingAverage;

    private BigDecimal cumulativePerformance;

    private String status;
}
