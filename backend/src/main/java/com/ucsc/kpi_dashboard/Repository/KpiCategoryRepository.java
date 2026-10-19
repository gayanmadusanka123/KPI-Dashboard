package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface KpiCategoryRepository extends JpaRepository<KpiCategory, UUID> {
}