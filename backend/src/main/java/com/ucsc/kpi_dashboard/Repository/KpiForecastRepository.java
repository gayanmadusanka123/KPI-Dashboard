package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiActual;
import com.ucsc.kpi_dashboard.Model.KpiForecast;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface KpiForecastRepository extends JpaRepository<KpiForecast, UUID> {
    List<KpiForecast> findByKpi_IdOrderByForecastDateAsc(UUID kpiId);
}
