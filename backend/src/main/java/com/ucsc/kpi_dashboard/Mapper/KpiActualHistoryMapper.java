package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiActualHistory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualHistoryDto;

public class KpiActualHistoryMapper {

    public static KpiActualHistoryDto toDto(
            KpiActualHistory history) {

        KpiActualHistoryDto dto = new KpiActualHistoryDto();

        dto.setId(history.getId());
        dto.setActualId(history.getActual().getId());
        dto.setOldActualValue(history.getOldActualValue());
        dto.setNewActualValue(history.getNewActualValue());
        dto.setOldDataConfidence(history.getOldDataConfidence());
        dto.setNewDataConfidence(history.getNewDataConfidence());
        dto.setEditReason(history.getEditReason());
        dto.setRecordedAt(history.getRecordedAt());
        dto.setRecordedById(
                history.getRecordedBy() != null
                        ? history.getRecordedBy().getId()
                        : null
        );

        return dto;
    }
}