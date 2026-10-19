package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.DataConfidence;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class KpiActualRequestDto {

    @NotNull
    private UUID kpiId;

    @NotNull
    private UUID periodId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal actualValue;

    @NotNull
    private DataConfidence dataConfidence;

    private String editReason;
}