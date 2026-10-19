package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.DataConfidence;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class KpiActualDto {

    private UUID id;
    private UUID kpiId;
    private UUID periodId;
    private BigDecimal actualValue;
    private DataConfidence dataConfidence;
    private LocalDateTime createdAt;
    private UUID createdById;
    private LocalDateTime updatedAt;
    private UUID updatedById;
}