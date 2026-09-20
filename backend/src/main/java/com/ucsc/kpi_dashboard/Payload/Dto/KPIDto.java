package com.ucsc.kpi_dashboard.Payload.Dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class KPIDto {

    private Long id;

    private String kpiName;
    private String kpiDescription;

    private Long categoryId;
    private Long departmentId;
    private UUID ownerId;

    private String dataSource;
    private String measurementUnit;
    private String reportingFrequency;
    private String directionOfGood;

    private String status;

    private String notes;

    private List<Long> tagIds;

    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}