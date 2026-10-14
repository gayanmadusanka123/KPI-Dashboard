package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Exeptions.ResourceNotFoundException;
import com.ucsc.kpi_dashboard.Mapper.DepartmentMapper;
import com.ucsc.kpi_dashboard.Model.Department;
import com.ucsc.kpi_dashboard.Payload.Dto.DepartmentDto;
import com.ucsc.kpi_dashboard.Repository.DepartmentRepository;
import com.ucsc.kpi_dashboard.Service.DepartmentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {

        Department department = DepartmentMapper.toEntity(dto);

        Department savedDepartment =
                departmentRepository.save(department);

        return DepartmentMapper.toDto(savedDepartment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(DepartmentMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(UUID id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with ID: " + id));

        return DepartmentMapper.toDto(department);
    }

    @Override
    public DepartmentDto updateDepartment(
            UUID id, DepartmentDto dto) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with ID: " + id));

        DepartmentMapper.updateEntity(dto, department);

        Department updatedDepartment =
                departmentRepository.save(department);

        return DepartmentMapper.toDto(updatedDepartment);
    }

    @Override
    public void deleteDepartment(UUID id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with ID: " + id));

        departmentRepository.delete(department);
    }
}