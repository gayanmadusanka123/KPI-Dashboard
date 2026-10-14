package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import com.ucsc.kpi_dashboard.Domain.UserRole;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserDto {

    private UUID id;

    private String userName;

    private String email;
    private String password;

    private UserRole role;
    private ActiveStatus status;
    private UUID departmentId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

}
