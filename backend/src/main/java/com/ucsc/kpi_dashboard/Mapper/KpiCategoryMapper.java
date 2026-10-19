package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiCategory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiCategoryDto;

public class KpiCategoryMapper {

    // Convert Entity to DTO
    public static KpiCategoryDto toDto(KpiCategory category) {

        if (category == null) {
            return null;
        }

        KpiCategoryDto dto = new KpiCategoryDto();

        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setStatus(category.getStatus());

        return dto;
    }

    // Convert DTO to Entity
    public static KpiCategory toEntity(KpiCategoryDto dto) {

        if (dto == null) {
            return null;
        }

        KpiCategory category = new KpiCategory();

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setStatus(dto.getStatus());

        return category;
    }

    // Update an existing Entity using DTO data
    public static void updateEntity(
            KpiCategoryDto dto,
            KpiCategory category) {

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setStatus(dto.getStatus());
    }
}
