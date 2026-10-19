package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiActualHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface KpiActualHistoryRepository
        extends JpaRepository<KpiActualHistory, UUID> {

    List<KpiActualHistory> findByActual_IdOrderByRecordedAtDesc(
            UUID actualId
    );
}