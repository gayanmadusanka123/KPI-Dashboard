package com.ucsc.kpi_dashboard.Repository;

import com.ucsc.kpi_dashboard.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findUserByEmail(String email);
    boolean existsByEmail(String Email);
}
