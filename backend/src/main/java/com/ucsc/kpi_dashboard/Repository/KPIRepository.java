package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KPI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KPIRepository extends JpaRepository<KPI, Long> {
}