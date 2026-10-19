package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Mapper.UserMapper;
import com.ucsc.kpi_dashboard.Model.User;
import com.ucsc.kpi_dashboard.Payload.Dto.UserDto;
import com.ucsc.kpi_dashboard.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(
            @RequestHeader("Authorization") String jwtToken
    ) throws UserException {
        User user = userService.getUserByJwtToken(jwtToken);

        return ResponseEntity.ok(UserMapper.toDto(user));

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable UUID id,@RequestHeader("Authorization")  String jwtToken
    ) throws UserException {
        User user = userService.getUserById(id);

        if(user==null){
            throw new UserException("User not found");
        }

        return ResponseEntity.ok(UserMapper.toDto(user));

    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() throws UserException {
        return ResponseEntity.ok(
                userService.getAllUsers()
                        .stream()
                        .map(UserMapper::toDto)
                        .toList()
        );
    }
}
