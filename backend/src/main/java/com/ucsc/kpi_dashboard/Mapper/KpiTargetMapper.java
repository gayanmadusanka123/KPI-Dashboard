package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiTarget;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiTargetDto;

public class KpiTargetMapper {

    public static KpiTargetDto toDto(KpiTarget target) {
        KpiTargetDto dto = new KpiTargetDto();

        dto.setId(target.getId());
        dto.setKpiId(target.getKpi().getId());
        dto.setPeriodId(target.getPeriod().getId());
        dto.setTargetValue(target.getTargetValue());
        dto.setCreatedAt(target.getCreatedAt());
        dto.setCreatedById(
                target.getCreatedBy() != null
                        ? target.getCreatedBy().getId()
                        : null
        );
        dto.setUpdatedAt(target.getUpdatedAt());
        dto.setUpdatedById(
                target.getUpdatedBy() != null
                        ? target.getUpdatedBy().getId()
                        : null
        );

        return dto;
    }
}