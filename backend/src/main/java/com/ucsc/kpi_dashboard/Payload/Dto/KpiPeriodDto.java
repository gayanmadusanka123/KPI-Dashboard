package com.ucsc.kpi_dashboard.Payload.Dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class KpiPeriodDto {

    private UUID id;
    private UUID kpiId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private String periodLabel;
    private Integer periodSequence;
    private LocalDateTime createdAt;
}