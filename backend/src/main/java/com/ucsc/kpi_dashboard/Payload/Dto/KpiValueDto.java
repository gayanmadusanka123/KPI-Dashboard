package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Model.KpiProfile;
import lombok.Data;

import java.time.LocalDate;

@Data
public class KpiValueDto {
    private Long id;

    private KpiTypes kpiType;

    private double actualValue;

    private LocalDate valueDate;

    private String status;

    private double normalizedValue;
}
