package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}