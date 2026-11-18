package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiTarget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface KpiTargetRepository
        extends JpaRepository<KpiTarget, UUID> {

    List<KpiTarget> findByKpi_IdOrderByPeriod_PeriodStartAsc(UUID kpiId);
}
