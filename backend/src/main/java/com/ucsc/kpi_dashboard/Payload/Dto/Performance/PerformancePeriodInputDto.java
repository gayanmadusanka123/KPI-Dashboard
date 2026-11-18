package com.ucsc.kpi_dashboard.Payload.Dto.Performance;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class PerformancePeriodInputDto {
    private UUID periodId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal actualValue;
    private BigDecimal targetValue;
}
