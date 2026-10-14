package com.ucsc.kpi_dashboard.Model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name="tag")
public class Tag {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(unique=true)
    private String name;

}