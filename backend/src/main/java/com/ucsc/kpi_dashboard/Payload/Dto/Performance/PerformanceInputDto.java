package com.ucsc.kpi_dashboard.Payload.Dto.Performance;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PerformanceInputDto {
    private UUID kpiId;
    private String kpiName;
    private String directionOfGood;
    private List<PerformancePeriodInputDto> periods;
}
