package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.Department;
import com.ucsc.kpi_dashboard.Payload.Dto.DepartmentDto;

public class DepartmentMapper {

    // Convert Entity to DTO
    public static DepartmentDto toDto(Department department) {

        if (department == null) {
            return null;
        }

        DepartmentDto dto = new DepartmentDto();

        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setStatus(department.getStatus());

        return dto;
    }

    // Convert DTO to Entity
    public static Department toEntity(DepartmentDto dto) {

        if (dto == null) {
            return null;
        }

        Department department = new Department();

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setStatus(dto.getStatus());

        return department;
    }

    // Update an existing Entity
    public static void updateEntity(
            DepartmentDto dto,
            Department department) {

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setStatus(dto.getStatus());
    }
}
