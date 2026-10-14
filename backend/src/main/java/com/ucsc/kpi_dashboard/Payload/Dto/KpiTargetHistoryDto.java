package com.ucsc.kpi_dashboard.Payload.Dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class KpiTargetHistoryDto {

    private UUID id;
    private UUID targetId;
    private BigDecimal oldTargetValue;
    private BigDecimal newTargetValue;
    private String editReason;
    private LocalDateTime recordedAt;
    private UUID recordedById;
}