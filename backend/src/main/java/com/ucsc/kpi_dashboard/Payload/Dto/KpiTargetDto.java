package com.ucsc.kpi_dashboard.Payload.Dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class KpiTargetDto {

    private UUID id;
    private UUID kpiId;
    private UUID periodId;
    private BigDecimal targetValue;
    private LocalDateTime createdAt;
    private UUID createdById;
    private LocalDateTime updatedAt;
    private UUID updatedById;
}