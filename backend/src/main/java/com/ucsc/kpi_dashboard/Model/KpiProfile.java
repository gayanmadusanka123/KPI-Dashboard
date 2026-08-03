package com.ucsc.kpi_dashboard.Model;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "kpi_profiles")
public class KpiProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,unique = true)
    private KpiTypes kpiType;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private double target;

    @Column(nullable = false)
    private double warningThreshold;

    @Column(nullable = false)
    private double criticalThreshold;

    @Column(nullable = false)
    private  double weight;

    @Column(nullable = false)
    private  Boolean higherBetter;

}
