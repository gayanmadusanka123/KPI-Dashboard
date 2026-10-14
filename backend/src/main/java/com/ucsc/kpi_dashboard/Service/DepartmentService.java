package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.DepartmentDto;

import java.util.List;
import java.util.UUID;

public interface DepartmentService {

    // Create a new department
    DepartmentDto createDepartment(DepartmentDto dto);

    // Get all departments
    List<DepartmentDto> getAllDepartments();

    // Get a department by ID
    DepartmentDto getDepartmentById(UUID id);

    // Update an existing department
    DepartmentDto updateDepartment(UUID id, DepartmentDto dto);

    // Delete a department
    void deleteDepartment(UUID id);
}
