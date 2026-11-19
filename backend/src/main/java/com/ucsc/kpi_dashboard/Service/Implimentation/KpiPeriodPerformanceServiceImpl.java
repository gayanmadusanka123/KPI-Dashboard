package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Model.KpiPeriod;
import com.ucsc.kpi_dashboard.Model.KpiPeriodPerformance;
import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultBatchRequestDto;
import com.ucsc.kpi_dashboard.Payload.Dto.Performance.PerformanceResultDto;
import com.ucsc.kpi_dashboard.Repository.KpiPeriodPerformanceRepository;
import com.ucsc.kpi_dashboard.Repository.KpiPeriodRepository;
import com.ucsc.kpi_dashboard.Repository.KpiRepository;
import com.ucsc.kpi_dashboard.Service.KpiPeriodPerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KpiPeriodPerformanceServiceImpl implements KpiPeriodPerformanceService {

    private final KpiRepository kpiRepository;
    private final KpiPeriodRepository kpiPeriodRepository;
    private final KpiPeriodPerformanceRepository kpiPeriodPerformanceRepository;

    public void savePerformanceResults(PerformanceResultBatchRequestDto request) {

        UUID kpiId = request.getKpiId();

        Kpi kpi = kpiRepository.findById(kpiId)
                .orElseThrow(() -> new RuntimeException("KPI NOT FOUND"));

        List<KpiPeriodPerformance> performances = new ArrayList<>();

        for(PerformanceResultDto result : request.getResults()) {
            UUID periodId = result.getPeriodId();

            KpiPeriod period = kpiPeriodRepository.findById(periodId)
                    .orElseThrow(() -> new RuntimeException("Period not found: " + periodId));

            if(!period.getKpi().getId().equals(kpiId)) {
                throw new IllegalArgumentException(
                        "Period " + periodId + " does not belong to KPI " + kpiId
                );
            }

            KpiPeriodPerformance performance =
                    kpiPeriodPerformanceRepository
                            .findByKpi_IdAndPeriod_Id(kpiId, periodId)
                            .orElseGet(KpiPeriodPerformance::new);

            performance.setKpi(kpi);
            performance.setPeriod(period);

            performance.setPerformanceScore(result.getPerformanceScore());
            performance.setVariance(result.getVariance());
            performance.setVariancePercent(result.getVariancePercent());
            performance.setPeriodChangePercent(result.getPeriodChangePercent());
            performance.setTrendDirection(result.getTrendDirection());
            performance.setRollingAverage(result.getRollingAverage());
            performance.setCumulativePerformance(result.getCumulativePerformance());
            performance.setStatus(result.getStatus());

            performance.setCalculatedAt(LocalDateTime.now());

            performances.add(performance);
        }

        kpiPeriodPerformanceRepository.saveAll(performances);
    }
}
