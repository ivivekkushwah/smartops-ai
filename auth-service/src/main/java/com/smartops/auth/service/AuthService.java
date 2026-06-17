package com.smartops.auth.service;

import com.smartops.auth.dto.RegisterRequest;
import com.smartops.auth.dto.UpdateUserSettingsRequest;
import com.smartops.auth.dto.UserResponse;
import com.smartops.auth.dto.UserSettingsResponse;

public interface AuthService {

    String register(RegisterRequest request);

    String login(String email, String password);

    UserResponse getCurrentUser(String userId);
    UserSettingsResponse getSettings(String userId);

    UserSettingsResponse updateSettings(
            String userId,
            UpdateUserSettingsRequest request
    );
}