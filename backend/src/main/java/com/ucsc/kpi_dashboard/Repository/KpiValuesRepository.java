package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiValues;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KpiValuesRepository extends JpaRepository<KpiValues,Long>
{
    List<KpiValues> findByKpiProfileIdOrderByValueDateDesc(Long kpiProfileId);
}
