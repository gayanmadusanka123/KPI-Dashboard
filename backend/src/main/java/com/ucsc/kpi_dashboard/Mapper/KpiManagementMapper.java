package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.Kpi;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiDto;

public class KpiManagementMapper {

    public static KpiDto toDto(Kpi kpi) {

        KpiDto dto = new KpiDto();

        dto.setId(kpi.getId());
        dto.setKpiCode(kpi.getKpiCode());
        dto.setName(kpi.getName());
        dto.setDescription(kpi.getDescription());

        dto.setCategoryId(
                kpi.getCategory() != null
                        ? kpi.getCategory().getId()
                        : null
        );
        dto.setCategoryName(
                kpi.getCategory() != null
                        ? kpi.getCategory().getName()
                        : null
        );

        dto.setDepartmentId(
                kpi.getDepartment() != null
                        ? kpi.getDepartment().getId()
                        : null
        );
        dto.setDepartmentName(
                kpi.getDepartment() != null
                        ? kpi.getDepartment().getName()
                        : null
        );

        dto.setOwnerId(
                kpi.getOwner() != null
                        ? kpi.getOwner().getId()
                        : null
        );
        dto.setOwnerName(
                kpi.getOwner() != null
                        ? kpi.getOwner().getUserName()
                        : null
        );

        dto.setDataSource(kpi.getDataSource());
        dto.setMeasurementUnit(kpi.getMeasurementUnit());
        dto.setReportingFrequency(kpi.getReportingFrequency());
        dto.setDirectionOfGood(kpi.getDirectionOfGood());
        dto.setStatus(kpi.getStatus());
        dto.setNotes(kpi.getNotes());

        dto.setCreatedAt(kpi.getCreatedAt());
        dto.setCreatedById(
                kpi.getCreatedBy() != null
                        ? kpi.getCreatedBy().getId()
                        : null
        );

        dto.setUpdatedAt(kpi.getUpdatedAt());
        dto.setUpdatedById(
                kpi.getUpdatedBy() != null
                        ? kpi.getUpdatedBy().getId()
                        : null
        );

        return dto;
    }
}