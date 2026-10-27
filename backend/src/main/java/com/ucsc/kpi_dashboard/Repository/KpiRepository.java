package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface KpiRepository
        extends JpaRepository<Kpi, UUID> {

    List<Kpi> findByStatusNot(ActiveStatus status);
}