package com.ucsc.kpi_dashboard.Payload.Dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class KpiActualObservationDto {
    private UUID kpiId;
    private String kpiName;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal actualValue;
}
