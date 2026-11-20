package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultBatchRequestDto;
import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultsResponseDto;

import java.util.UUID;

public interface KpiPeriodPerformanceService {
    void savePerformanceResults(
            PerformanceResultBatchRequestDto request
    );

    PerformanceResultsResponseDto getPerformanceResults(UUID kpiId);
}
