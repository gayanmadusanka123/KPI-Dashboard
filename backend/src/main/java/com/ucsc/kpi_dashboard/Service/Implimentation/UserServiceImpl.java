package com.ucsc.kpi_dashboard.Service.Implimentation;

import com.ucsc.kpi_dashboard.Configurations.JwtProvider;
import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Model.User;
import com.ucsc.kpi_dashboard.Repository.UserRepository;
import com.ucsc.kpi_dashboard.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;


    @Override
    public User getUserByJwtToken(String jwtToken) throws UserException {

        String email = jwtProvider.getEmailFromToken(jwtToken);

        User user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new UserException("User not found");
        }
        return user;
    }

    @Override
    public User getCurrentUser() throws UserException {

        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new UserException("User not found");
        }
        return user;
    }

    @Override
    public User getCurrentUserByEmail(String email) throws UserException {
        User user = userRepository.findUserByEmail(email);
        if (user == null) {
            throw new UserException("User not found");
        }

        return user;

    }

    @Override
    public User getUserById(UUID id) throws UserException {
        return userRepository.findById(id).orElseThrow(
                () -> new UserException("User not found")
        );
    }

    @Override
    public List<User> getAllUsers() throws UserException {
        return userRepository.findAll();
    }
}
