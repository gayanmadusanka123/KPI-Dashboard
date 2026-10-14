package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiPeriod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface KpiPeriodRepository
        extends JpaRepository<KpiPeriod, UUID> {
}