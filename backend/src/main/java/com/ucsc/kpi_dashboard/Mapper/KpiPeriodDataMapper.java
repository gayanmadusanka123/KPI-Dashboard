package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiPeriodData;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiPeriodDataDto;

public class KpiPeriodDataMapper {

    public static KpiPeriodDataDto toDto(KpiPeriodData periodData) {

        KpiPeriodDataDto dto = new KpiPeriodDataDto();

        dto.setId(periodData.getId());

        if (periodData.getKpi() != null)
            dto.setKpiId(periodData.getKpi().getId());

        dto.setPeriod(periodData.getPeriod());
        dto.setTargetValue(periodData.getTargetValue());
        dto.setActualValue(periodData.getActualValue());

        dto.setPerformanceScore(periodData.getPerformanceScore());
        dto.setVariance(periodData.getVariance());
        dto.setVariancePercentage(periodData.getVariancePercentage());

        dto.setPerformanceStatus(periodData.getPerformanceStatus());

        dto.setNotes(periodData.getNotes());
        dto.setConfidenceLevel(periodData.getConfidenceLevel());

        if (periodData.getEnteredBy() != null)
            dto.setEnteredBy(periodData.getEnteredBy().getId());

        dto.setEntryDate(periodData.getEntryDate());

        return dto;
    }

    public static KpiPeriodData toEntity(KpiPeriodDataDto dto) {

        KpiPeriodData periodData = new KpiPeriodData();

        periodData.setId(dto.getId());

        periodData.setPeriod(dto.getPeriod());

        periodData.setTargetValue(dto.getTargetValue());
        periodData.setActualValue(dto.getActualValue());

        periodData.setPerformanceScore(dto.getPerformanceScore());
        periodData.setVariance(dto.getVariance());
        periodData.setVariancePercentage(dto.getVariancePercentage());

        periodData.setPerformanceStatus(dto.getPerformanceStatus());

        periodData.setNotes(dto.getNotes());
        periodData.setConfidenceLevel(dto.getConfidenceLevel());


        return periodData;
    }
}