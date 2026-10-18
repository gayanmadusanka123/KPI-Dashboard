package com.ucsc.kpi_dashboard.Payload.Dto;

import com.ucsc.kpi_dashboard.Domain.ActiveStatus;
import com.ucsc.kpi_dashboard.Domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserDto {

    public interface SignupValidation {
    }

    private UUID id;

    @NotBlank(groups = SignupValidation.class)
    @Size(min = 2, groups = SignupValidation.class)
    private String userName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotNull(groups = SignupValidation.class)
    private UserRole role;
    private ActiveStatus status;
    private UUID departmentId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

}
