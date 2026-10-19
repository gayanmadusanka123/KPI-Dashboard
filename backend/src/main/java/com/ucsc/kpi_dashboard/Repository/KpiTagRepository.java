package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface KpiTagRepository
        extends JpaRepository<KpiTag, UUID> {
}
