package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class KpiDto {

    private UUID id;
    private String kpiCode;
    private String name;
    private String description;
    private UUID categoryId;
    private UUID departmentId;
    private UUID ownerId;
    private String dataSource;
    private String measurementUnit;
    private String reportingFrequency;
    private String directionOfGood;
    private ActiveStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private UUID createdById;
    private LocalDateTime updatedAt;
    private UUID updatedById;
}