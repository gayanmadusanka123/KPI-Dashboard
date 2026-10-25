package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiPeriod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

public interface KpiPeriodRepository
        extends JpaRepository<KpiPeriod, UUID> {

    boolean existsByKpiIdAndPeriodStartAndPeriodEnd(
            UUID kpiId,
            LocalDate periodStart,
            LocalDate periodEnd
    );

    List<KpiPeriod> findByKpi_IdOrderByPeriodStartDesc(UUID kpiId);
}