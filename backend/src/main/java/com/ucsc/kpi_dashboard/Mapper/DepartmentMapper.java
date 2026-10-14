package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.Department;
import com.ucsc.kpi_dashboard.Payload.Dto.DepartmentDto;

public class DepartmentMapper {

    public static DepartmentDto toDto(Department department) {

        DepartmentDto dto = new DepartmentDto();

        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setActive(department.getActive());

        return dto;
    }

    public static Department toEntity(DepartmentDto dto) {

        Department department = new Department();

        department.setId(dto.getId());
        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setActive(dto.getActive());

        return department;
    }
}