package com.smartops.auth.service;

import com.smartops.auth.dto.RegisterRequest;
import com.smartops.auth.dto.UserResponse;
import com.smartops.auth.model.Role;
import com.smartops.common.event.LogEvent;
import com.smartops.auth.kafka.KafkaProducerService;
import com.smartops.auth.model.User;
import com.smartops.auth.repo.UserRepo;
import com.smartops.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final KafkaProducerService producer;

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User already exists"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(Role.USER); // 🔥 DEFAULT ROLE

        userRepository.save(user);


        producer.sendLog(
                "AUTH-SERVICE",
                "INFO",
                "New user registered: " + user.getEmail()
        );

        return "User registered successfully";
    }

    @Override
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(password, user.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        producer.sendLog(
                "AUTH-SERVICE",
                "INFO",
                "User logged in: " + user.getEmail()
        );

        return jwtUtil.generateToken(user);
    }

    @Override
    public UserResponse getCurrentUser(String userId) {

        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}