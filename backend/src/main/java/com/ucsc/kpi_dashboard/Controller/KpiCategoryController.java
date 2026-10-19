package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiCategoryDto;
import com.ucsc.kpi_dashboard.Service.KpiCategoryService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kpi-categories")
public class KpiCategoryController {

    private final KpiCategoryService kpiCategoryService;

    public KpiCategoryController(
            KpiCategoryService kpiCategoryService) {
        this.kpiCategoryService = kpiCategoryService;
    }

    // Create a category
    @PostMapping
    public ResponseEntity<KpiCategoryDto> createCategory(
            @Valid @RequestBody KpiCategoryDto dto) {

        KpiCategoryDto createdCategory =
                kpiCategoryService.createCategory(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdCategory);
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<List<KpiCategoryDto>> getAllCategories() {

        return ResponseEntity.ok(
                kpiCategoryService.getAllCategories());
    }

    // Get a category by ID
    @GetMapping("/{id}")
    public ResponseEntity<KpiCategoryDto> getCategoryById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                kpiCategoryService.getCategoryById(id));
    }

    // Update a category
    @PutMapping("/{id}")
    public ResponseEntity<KpiCategoryDto> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody KpiCategoryDto dto) {

        return ResponseEntity.ok(
                kpiCategoryService.updateCategory(id, dto));
    }

    // Delete a category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable UUID id) {

        kpiCategoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}