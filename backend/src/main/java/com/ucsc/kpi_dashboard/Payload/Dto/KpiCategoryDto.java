package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KpiCategoryDto {

    private UUID id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    @NotNull(message = "Category status is required")
    private ActiveStatus status;
}
