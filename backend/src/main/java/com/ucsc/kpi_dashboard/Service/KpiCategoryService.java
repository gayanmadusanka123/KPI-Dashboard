package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Exeptions.KpiCategoryException;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiCategoryDto;

import java.util.List;

public interface KpiCategoryService {

    KpiCategoryDto createCategory(KpiCategoryDto dto) throws KpiCategoryException;

    KpiCategoryDto updateCategory(Long id, KpiCategoryDto dto) throws KpiCategoryException;

    KpiCategoryDto getCategoryById(Long id) throws KpiCategoryException;

    List<KpiCategoryDto> getAllCategories() throws KpiCategoryException;

    void deleteCategory(Long id) throws KpiCategoryException;
}