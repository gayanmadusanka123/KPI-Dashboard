package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
}
