package com.ucsc.kpi_dashboard.Payload.Dto.Performance;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class PerformanceResultResponseDto {
    private UUID periodId;

    private String periodLabel;

    private LocalDate periodStart;

    private LocalDate periodEnd;

    private BigDecimal actualValue;

    private BigDecimal targetValue;

    private BigDecimal performanceScore;

    private BigDecimal variance;

    private BigDecimal variancePercent;

    private BigDecimal periodChangePercent;

    private String trendDirection;

    private BigDecimal rollingAverage;

    private BigDecimal cumulativePerformance;

    private String status;
}
