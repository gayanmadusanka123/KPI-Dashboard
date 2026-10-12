package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Model.KpiProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KpiProfileRepository extends JpaRepository<KpiProfile,Long> {
    Optional<KpiProfile> findByKpiType(KpiTypes kpiTypes);

}
