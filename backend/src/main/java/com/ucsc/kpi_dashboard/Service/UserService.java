package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {

    User getUserByJwtToken(String jwtToken) throws UserException;

    User getCurrentUser() throws UserException;
    User getCurrentUserByEmail(String email) throws UserException;

    User getUserById(UUID id) throws UserException;

    List<User> getAllUsers() throws UserException;
}
