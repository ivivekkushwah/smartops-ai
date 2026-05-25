package com.smartops.auth.service;

import com.smartops.auth.dto.RegisterRequest;
import com.smartops.auth.dto.UserResponse;

public interface AuthService {

    String register(RegisterRequest request);

    String login(String email, String password);

    UserResponse getCurrentUser(String userId);
}