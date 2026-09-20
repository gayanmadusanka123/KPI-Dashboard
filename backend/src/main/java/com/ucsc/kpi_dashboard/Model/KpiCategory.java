package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="kpi_category")
public class KpiCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, unique = true)
    private String name;


    private String description;


    private Boolean active = true;

}