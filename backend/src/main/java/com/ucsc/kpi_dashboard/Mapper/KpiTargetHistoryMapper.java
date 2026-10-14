package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiTargetHistory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetHistoryDto;

public class KpiTargetHistoryMapper {

    public static KpiTargetHistoryDto toDto(
            KpiTargetHistory history) {

        KpiTargetHistoryDto dto = new KpiTargetHistoryDto();

        dto.setId(history.getId());
        dto.setTargetId(history.getTarget().getId());
        dto.setOldTargetValue(history.getOldTargetValue());
        dto.setNewTargetValue(history.getNewTargetValue());
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