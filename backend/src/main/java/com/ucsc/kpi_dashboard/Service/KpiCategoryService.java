package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Payload.Dto.KpiCategoryDto;

import java.util.List;
import java.util.UUID;

public interface KpiCategoryService {

    // Create a new KPI category
    KpiCategoryDto createCategory(KpiCategoryDto dto);

    // Get all KPI categories
    List<KpiCategoryDto> getAllCategories();

    // Get a category by ID
    KpiCategoryDto getCategoryById(UUID id);

    // Update an existing category
    KpiCategoryDto updateCategory(UUID id, KpiCategoryDto dto);

    // Delete a category
    void deleteCategory(UUID id);
}
