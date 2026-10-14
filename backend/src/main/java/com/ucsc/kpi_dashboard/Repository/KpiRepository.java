package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.Kpi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface KpiRepository
        extends JpaRepository<Kpi, UUID> {
}