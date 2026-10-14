package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Exeptions.DepartmentException;
import com.ucsc.kpi_dashboard.Payload.Dto.DepartmentDto;

import java.util.List;

public interface DepartmentService {

    DepartmentDto createDepartment(DepartmentDto dto) throws DepartmentException;

    DepartmentDto updateDepartment(Long id, DepartmentDto dto) throws DepartmentException;

    DepartmentDto getDepartmentById(Long id) throws DepartmentException;

    List<DepartmentDto> getAllDepartments() throws DepartmentException;

    void deleteDepartment(Long id) throws DepartmentException;
}