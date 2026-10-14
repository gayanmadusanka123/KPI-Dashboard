package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiTagMap;
import com.ucsc.kpi_dashboard.Model.KpiTagMapId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KpiTagMapRepository
        extends JpaRepository<KpiTagMap, KpiTagMapId> {
}