package com.smartops.auth.controller;



import com.smartops.auth.dto.*;
import com.smartops.auth.security.JwtUtil;
import com.smartops.auth.service.AuthService;
import com.smartops.auth.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    private final ProfileService profileService;

    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    @Value("${app.cookie.same-site}")
    private String cookieSameSite;


    // ==========================================
    // CURRENT USER
    // ==========================================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        String userId = request.getHeader("X-User-Id"); // ✅ FIXED
        if (userId == null || userId.isBlank()) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(authService.getCurrentUser(userId)); // ✅ FIXED
    }

    // ==========================================
    // REGISTER
    // ==========================================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    // ==========================================
    // LOGIN
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {

        try {
            String token = authService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            addTokenCookie(response, token, 60 * 60);

            return ResponseEntity.ok(
                    Map.of("message", "Login successful")
            );

        } catch (org.springframework.web.server.ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(
                    Map.of("message", "Invalid email or password")
            );
        }
    }

    // ==========================================
    // LOGOUT
    // ==========================================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        addTokenCookie(response, "", 0);

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    private void addTokenCookie(HttpServletResponse response, String token, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
    @GetMapping("/settings")
    public UserSettingsResponse getSettings(
            @RequestHeader("X-User-Id") String userId
    ) {
        return authService.getSettings(userId);
    }

    @PutMapping("/settings")
    public UserSettingsResponse updateSettings(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UpdateUserSettingsRequest request
    ) {
        return authService.updateSettings(userId, request);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String userId,
            @RequestHeader("X-User-Id") String authenticatedUserId
    ) {

        if (!userId.equals(authenticatedUserId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Forbidden"));
        }

        authService.deleteUser(userId);

        return ResponseEntity.ok(
                Map.of("message", "User deleted successfully")
        );
    }

}
