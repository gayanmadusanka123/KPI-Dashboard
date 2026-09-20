package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Data
@Table(name="kpi")
public class KPI {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable=false)
    private String kpiName;


    @Column(columnDefinition="TEXT")
    private String kpiDescription;


    @ManyToOne
    @JoinColumn(name="category_id")
    private KpiCategory category;


    @ManyToOne
    @JoinColumn(name="department_id")
    private Department department;


    @ManyToOne
    @JoinColumn(name="owner_id")
    private User owner;

    private String dataSource;

    private String measurementUnit;

    private String reportingFrequency;

    private String directionOfGood;

    private String status;

    @Column(columnDefinition="TEXT")
    private String notes;

    private LocalDateTime createdDate;

    private LocalDateTime modifiedDate;

    @ManyToMany
    @JoinTable(
            name="kpi_tag",
            joinColumns=@JoinColumn(name="kpi_id"),
            inverseJoinColumns=@JoinColumn(name="tag_id")
    )
    private List<Tag> tags;


}