package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiProfile;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiProfileDto;

//@Mapper(componentModel = "spring")
public class KpiProfileMapper {

//    static KpiProfileDto toDto(KpiProfile kpiProfile);

//    KpiProfile toEntity(KpiProfileDto kpiProfileDto);

    public static KpiProfileDto toDto(KpiProfile kpiProfile) {
        if(kpiProfile==null){
            return null;
        }
        KpiProfileDto kpiProfileDto = new KpiProfileDto();

        kpiProfileDto.setId(kpiProfile.getId());
        kpiProfileDto.setKpiType(kpiProfile.getKpiType());
        kpiProfileDto.setUnit(kpiProfile.getUnit());
        kpiProfileDto.setName(kpiProfile.getName());
        kpiProfileDto.setTarget(kpiProfile.getTarget());
        kpiProfileDto.setHigherBetter(kpiProfile.getHigherBetter());
        kpiProfileDto.setWeight(kpiProfile.getWeight());
        kpiProfileDto.setCriticalThreshold(kpiProfile.getCriticalThreshold());
        kpiProfileDto.setWarningThreshold(kpiProfile.getWarningThreshold());
        return kpiProfileDto;
    }

    public static KpiProfile toEntity(KpiProfileDto kpiProfileDto) {
        if(kpiProfileDto==null){
            return null;
        }
        KpiProfile kpiProfile = new KpiProfile();

        kpiProfile.setId(kpiProfileDto.getId());
        kpiProfile.setKpiType(kpiProfileDto.getKpiType());
        kpiProfile.setUnit(kpiProfileDto.getUnit());
        kpiProfile.setName(kpiProfileDto.getName());
        kpiProfile.setTarget(kpiProfileDto.getTarget());
        kpiProfile.setHigherBetter(kpiProfileDto.getHigherBetter());
        kpiProfile.setWeight(kpiProfileDto.getWeight());
        kpiProfile.setCriticalThreshold(kpiProfileDto.getCriticalThreshold());
        kpiProfile.setWarningThreshold(kpiProfileDto.getWarningThreshold());
        return kpiProfile;
    }
}
