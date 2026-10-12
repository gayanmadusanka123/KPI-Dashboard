package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiValues;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiValueDto;

//@Mapper(componentModel = "spring")
public class KpiValueMapper {



    public static KpiValueDto toDto(KpiValues kpiValues, String status, double normalizedValue) {
        if(kpiValues==null){
            return null;
        }
        KpiValueDto kpiValueDto = new KpiValueDto();

        kpiValueDto.setId(kpiValues.getId());
        kpiValueDto.setKpiType(kpiValues.getKpiProfile().getKpiType());
        kpiValueDto.setValueDate(kpiValues.getValueDate());
        kpiValueDto.setActualValue(kpiValues.getActualValue());
        kpiValueDto.setStatus(status);
        kpiValueDto.setNormalizedValue(normalizedValue);
        return kpiValueDto;
    }

    public static KpiValues toEntity(KpiValueDto kpiValueDto) {
        if(kpiValueDto==null){
            return null;
        }
        KpiValues kpiValues = new KpiValues();

        kpiValues.setId(kpiValueDto.getId());
        kpiValues.setValueDate(kpiValueDto.getValueDate());
        kpiValues.setActualValue(kpiValueDto.getActualValue());
        return kpiValues;
    }
}
