package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiPeriod;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiPeriodDto;

public class KpiPeriodMapper {

    public static KpiPeriodDto toDto(KpiPeriod period) {

        KpiPeriodDto dto = new KpiPeriodDto();

        dto.setId(period.getId());
        dto.setKpiId(
                period.getKpi() != null
                        ? period.getKpi().getId()
                        : null
        );
        dto.setPeriodStart(period.getPeriodStart());
        dto.setPeriodEnd(period.getPeriodEnd());
        dto.setPeriodLabel(period.getPeriodLabel());
        dto.setPeriodSequence(period.getPeriodSequence());
        dto.setCreatedAt(period.getCreatedAt());

        return dto;
    }
}