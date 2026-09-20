package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.KpiCategory;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiCategoryDto;

public class KpiCategoryMapper {

    public static KpiCategoryDto toDto(KpiCategory category) {

        KpiCategoryDto dto = new KpiCategoryDto();

        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setActive(category.getActive());

        return dto;
    }

    public static KpiCategory toEntity(KpiCategoryDto dto) {

        KpiCategory category = new KpiCategory();

        category.setId(dto.getId());
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setActive(dto.getActive());

        return category;
    }
}