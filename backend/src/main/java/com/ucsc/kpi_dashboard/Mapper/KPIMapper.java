package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KPI;
import com.ucsc.kpi_dashboard.Payload.Dto.KPIDto;

import java.util.stream.Collectors;

public class KPIMapper {

    public static KPIDto toDto(KPI kpi) {

        KPIDto dto = new KPIDto();

        dto.setId(kpi.getId());
        dto.setKpiName(kpi.getKpiName());
        dto.setKpiDescription(kpi.getKpiDescription());

        if (kpi.getCategory() != null)
            dto.setCategoryId(kpi.getCategory().getId());

        if (kpi.getDepartment() != null)
            dto.setDepartmentId(kpi.getDepartment().getId());

        if (kpi.getOwner() != null)
            dto.setOwnerId(kpi.getOwner().getId());

        dto.setDataSource(kpi.getDataSource());
        dto.setMeasurementUnit(kpi.getMeasurementUnit());
        dto.setReportingFrequency(kpi.getReportingFrequency());
        dto.setDirectionOfGood(kpi.getDirectionOfGood());

        dto.setStatus(kpi.getStatus());
        dto.setNotes(kpi.getNotes());

        dto.setCreatedDate(kpi.getCreatedDate());
        dto.setModifiedDate(kpi.getModifiedDate());

        if (kpi.getTags() != null) {
            dto.setTagIds(
                    kpi.getTags()
                            .stream()
                            .map(tag -> tag.getId())
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public static KPI toEntity(KPIDto dto) {

        KPI kpi = new KPI();

        kpi.setId(dto.getId());
        kpi.setKpiName(dto.getKpiName());
        kpi.setKpiDescription(dto.getKpiDescription());

        kpi.setDataSource(dto.getDataSource());
        kpi.setMeasurementUnit(dto.getMeasurementUnit());
        kpi.setReportingFrequency(dto.getReportingFrequency());
        kpi.setDirectionOfGood(dto.getDirectionOfGood());

        kpi.setStatus(dto.getStatus());
        kpi.setNotes(dto.getNotes());

        kpi.setCreatedDate(dto.getCreatedDate());
        kpi.setModifiedDate(dto.getModifiedDate());

        return kpi;
    }

}