package com.ucsc.kpi_dashboard.Payload.Dto.Performance;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PerformanceResultBatchRequestDto {

    @NotNull
    private UUID kpiId;

    @NotEmpty
    @Valid
    private List<PerformanceResultDto> results;
}
