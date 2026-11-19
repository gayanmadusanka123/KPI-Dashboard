package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultBatchRequestDto;

public interface KpiPeriodPerformanceService {
    void savePerformanceResults(
            PerformanceResultBatchRequestDto request
    );
}
