package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Model.User;
import com.ucsc.kpi_dashboard.Payload.Dto.UserDto;
import com.ucsc.kpi_dashboard.Payload.Response.AuthResponse;

public interface AuthService {

    AuthResponse SignUp(UserDto userDto) throws UserException;

    AuthResponse Login(UserDto userDto) throws UserException;
}
