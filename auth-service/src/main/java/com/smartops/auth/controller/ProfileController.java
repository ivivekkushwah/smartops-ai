package com.smartops.auth.controller;


import com.smartops.auth.dto.ChangePasswordRequest;
import com.smartops.auth.dto.ProfileRequest;
import com.smartops.auth.dto.ProfileResponse;
import com.smartops.auth.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ProfileResponse getProfile(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return profileService.getProfile(userId);
    }

    @PutMapping
    public ProfileResponse updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody ProfileRequest request
    ) {
        return profileService.updateProfile(userId, request);
    }

    @PutMapping("/change-password")
    public String changePassword(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody ChangePasswordRequest request
    ) {
        profileService.changePassword(userId, request);

        return "Password updated successfully";
    }
}