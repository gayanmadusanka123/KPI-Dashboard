package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiProfile;
import com.ucsc.kpi_dashboard.Model.KpiValues;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiProfileDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiValueDto;
import com.ucsc.kpi_dashboard.Repository.KpiValuesRepository;
import org.mapstruct.Mapper;

//@Mapper(componentModel = "spring")
public class KpiValueMapper {



    public static KpiValueDto toDto(KpiValues kpiValues) {
        if(kpiValues==null){
            return null;
        }
        KpiValueDto kpiValueDto = new KpiValueDto();

        kpiValueDto.setId(kpiValues.getId());
        kpiValueDto.setKpiProfile(kpiValues.getKpiProfile());
        kpiValueDto.setValueDate(kpiValues.getValueDate());
        kpiValueDto.setActualValue(kpiValues.getActualValue());
        return kpiValueDto;
    }

    public static KpiValues toEntity(KpiValueDto kpiValueDto) {
        if(kpiValueDto==null){
            return null;
        }
        KpiValues kpiValues = new KpiValues();

        kpiValues.setId(kpiValueDto.getId());
        kpiValues.setKpiProfile(kpiValueDto.getKpiProfile());
        kpiValues.setValueDate(kpiValueDto.getValueDate());
        kpiValues.setActualValue(kpiValueDto.getActualValue());
        return kpiValues;
    }
}
