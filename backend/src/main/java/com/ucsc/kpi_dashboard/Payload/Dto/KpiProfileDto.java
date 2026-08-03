package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class KpiProfileDto {
    private Long id;

    private KpiTypes kpiType;

    private String name;

    private String unit;

    private double target;

    private double warningThreshold;

    private double criticalThreshold;

    private  double weight;

    private  Boolean higherBetter;
}
