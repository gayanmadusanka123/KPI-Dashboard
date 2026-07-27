package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Configurations.JwtProvider;
import com.ucsc.kpi_dashboard.Domain.UserRole;
import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Mapper.UserMapper;
import com.ucsc.kpi_dashboard.Model.User;
import com.ucsc.kpi_dashboard.Payload.Dto.UserDto;
import com.ucsc.kpi_dashboard.Payload.Response.AuthResponse;
import com.ucsc.kpi_dashboard.Repository.UserRepository;
import com.ucsc.kpi_dashboard.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;

    @Override
    public AuthResponse SignUp(UserDto userDto) throws UserException {
        User user = userRepository.findUserByEmail(userDto.getEmail());

        if (user != null) {
            throw new UserException("Email already exists");
        }

//        if (userDto.getRole().equals(UserRole.ROLE_ADMIN)) {
//            throw new UserException("You are not allowed to perform this operation");
//        }

        if(userDto.getRole() == null){
            throw new UserException("Role is required");
        }

        if (userDto.getRole().equals(UserRole.ROLE_ADMIN)){
            throw new UserException("you are not admin");
        }

        User newUser = new User();
        newUser.setUserName(userDto.getUserName());
        newUser.setEmail(userDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setRole(userDto.getRole());

        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());
        newUser.setLastLogin(LocalDateTime.now());

        User savedUser = userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateJwtToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(jwt);
        authResponse.setMessage("Registered Successfully");
        authResponse.setUser(UserMapper.toDto(savedUser));

        return authResponse;

    }

    @Override
    public AuthResponse Login(UserDto userDto) throws UserException {
        String email = userDto.getEmail();
        String password = userDto.getPassword();

        Authentication authentication = authenticate(email, password);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String role = authorities.iterator().next().getAuthority();

        String token = jwtProvider.generateJwtToken(authentication);

        User user = userRepository.findUserByEmail(email);

        user.setLastLogin(LocalDateTime.now());

        userRepository.save(user);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(token);
        authResponse.setMessage("Login Successfully");
        authResponse.setUser(UserMapper.toDto(user));
        return authResponse;


    }

    private Authentication authenticate(String email, String password) throws UserException {
        UserDetails userDetails = customUserImplementation.loadUserByUsername(email);

        if (userDetails == null) {
            throw new UserException("Email not found");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("Wrong Password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }
}
