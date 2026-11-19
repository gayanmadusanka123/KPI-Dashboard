package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceInputDto;

import java.util.List;
import java.util.UUID;

public interface PerformanceInputService {
    PerformanceInputDto getPerformanceInputs(UUID kpiId);
}
