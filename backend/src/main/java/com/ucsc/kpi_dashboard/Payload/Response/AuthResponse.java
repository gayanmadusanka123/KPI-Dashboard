package com.ucsc.kpi_dashboard.Payload.Response;

import com.ucsc.kpi_dashboard.Payload.Dto.UserDto;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String message;
    private UserDto user;

}
