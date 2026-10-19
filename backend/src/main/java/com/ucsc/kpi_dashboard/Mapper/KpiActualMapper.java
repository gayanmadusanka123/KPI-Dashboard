package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiActual;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiActualDto;

public class KpiActualMapper {

    public static KpiActualDto toDto(KpiActual actual) {
        KpiActualDto dto = new KpiActualDto();

        dto.setId(actual.getId());
        dto.setKpiId(actual.getKpi().getId());
        dto.setPeriodId(actual.getPeriod().getId());
        dto.setActualValue(actual.getActualValue());
        dto.setDataConfidence(actual.getDataConfidence());
        dto.setCreatedAt(actual.getCreatedAt());
        dto.setCreatedById(
                actual.getCreatedBy() != null
                        ? actual.getCreatedBy().getId()
                        : null
        );
        dto.setUpdatedAt(actual.getUpdatedAt());
        dto.setUpdatedById(
                actual.getUpdatedBy() != null
                        ? actual.getUpdatedBy().getId()
                        : null
        );

        return dto;
    }
}