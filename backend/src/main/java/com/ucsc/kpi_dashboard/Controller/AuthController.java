package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Payload.Dto.UserDto;
import com.ucsc.kpi_dashboard.Payload.Response.AuthResponse;
import com.ucsc.kpi_dashboard.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> SignUp(@RequestBody UserDto userDto) throws UserException {
        return ResponseEntity.ok(authService.SignUp(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> Login(@RequestBody UserDto userDto) throws UserException {
        return ResponseEntity.ok(authService.Login(userDto));
    }


}
