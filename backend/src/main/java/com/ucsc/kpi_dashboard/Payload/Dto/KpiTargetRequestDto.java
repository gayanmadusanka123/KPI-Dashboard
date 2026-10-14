package com.ucsc.kpi_dashboard.Payload.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class KpiTargetRequestDto {

    @NotNull
    private UUID kpiId;

    @NotNull
    private UUID periodId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal targetValue;

    private String editReason;
}