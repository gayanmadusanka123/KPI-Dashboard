package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.DepartmentDto;
import com.ucsc.kpi_dashboard.Service.DepartmentService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Create a department
    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(
            @Valid @RequestBody DepartmentDto dto) {

        DepartmentDto createdDepartment =
                departmentService.createDepartment(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdDepartment);
    }

    // Get all departments
    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments());
    }

    // Get a department by ID
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                departmentService.getDepartmentById(id));
    }

    // Update a department
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(
            @PathVariable UUID id,
            @Valid @RequestBody DepartmentDto dto) {

        return ResponseEntity.ok(
                departmentService.updateDepartment(id, dto));
    }

    // Delete a department
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(
            @PathVariable UUID id) {

        departmentService.deleteDepartment(id);

        return ResponseEntity.noContent().build();
    }
}