package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiPeriodPerformance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface KpiPeriodPerformanceRepository
        extends JpaRepository<KpiPeriodPerformance, UUID> {

    List<KpiPeriodPerformance> findByKpi_IdOrderByPeriod_PeriodStartAsc(UUID kpiId);
}