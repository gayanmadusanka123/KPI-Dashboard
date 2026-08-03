package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.User;
import com.ucsc.kpi_dashboard.Payload.Dto.UserDto;

public class UserMapper {

    public static UserDto toDto(User savedUser) {
        UserDto userDto = new UserDto();

        userDto.setUserName(savedUser.getUserName());
        userDto.setEmail(savedUser.getEmail());
        userDto.setRole(savedUser.getRole());
        userDto.setCreatedAt(savedUser.getCreatedAt());
        userDto.setUpdatedAt(savedUser.getUpdatedAt());
        userDto.setLastLogin(savedUser.getLastLogin());
        return userDto;
    }

    public static User toEntity(UserDto userDto) {
        User user = new User();

        user.setId(userDto.getId());
        user.setUserName(userDto.getUserName());
        user.setEmail(userDto.getEmail());
        user.setRole(userDto.getRole());
        user.setCreatedAt(userDto.getCreatedAt());
        user.setUpdatedAt(userDto.getUpdatedAt());
        user.setLastLogin(userDto.getLastLogin());
        user.setPassword(userDto.getPassword());

        return user;
    }
}
