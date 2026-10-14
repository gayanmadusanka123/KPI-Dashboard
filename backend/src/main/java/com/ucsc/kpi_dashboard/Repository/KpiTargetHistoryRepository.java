package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.KpiTargetHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface KpiTargetHistoryRepository
        extends JpaRepository<KpiTargetHistory, UUID> {

    List<KpiTargetHistory> findByTarget_IdOrderByRecordedAtDesc(
            UUID targetId
    );
}