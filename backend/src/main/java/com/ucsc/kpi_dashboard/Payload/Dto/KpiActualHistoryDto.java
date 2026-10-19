package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.DataConfidence;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class KpiActualHistoryDto {

    private UUID id;
    private UUID actualId;
    private BigDecimal oldActualValue;
    private BigDecimal newActualValue;
    private DataConfidence oldDataConfidence;
    private DataConfidence newDataConfidence;
    private String editReason;
    private LocalDateTime recordedAt;
    private UUID recordedById;
}