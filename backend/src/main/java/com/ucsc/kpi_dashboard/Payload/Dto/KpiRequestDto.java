package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class KpiRequestDto {

    @NotBlank
    private String name;

    private String description;

    private UUID categoryId;

    private UUID departmentId;

    private UUID ownerId;

    private String dataSource;

    private String measurementUnit;

    private String reportingFrequency;

    private String directionOfGood;

    @NotNull
    private ActiveStatus status;

    private String notes;
}