package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiActual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface KpiActualRepository
        extends JpaRepository<KpiActual, UUID> {

    List<KpiActual> findByKpi_IdOrderByPeriod_PeriodStartAsc(UUID kpiId);
}
