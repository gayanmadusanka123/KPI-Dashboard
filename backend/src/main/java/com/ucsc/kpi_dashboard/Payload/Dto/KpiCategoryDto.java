package com.ucsc.kpi_dashboard.Payload.Dto;

import lombok.Data;

@Data
public class KpiCategoryDto {

    private Long id;

    private String name;

    private String description;

    private Boolean active;
}