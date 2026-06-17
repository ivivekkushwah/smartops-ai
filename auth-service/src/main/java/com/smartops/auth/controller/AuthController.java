package com.smartops.auth.controller;



import com.smartops.auth.dto.*;
import com.smartops.auth.security.JwtUtil;
import com.smartops.auth.service.AuthService;
import com.smartops.auth.service.ProfileService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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


    // ==========================================
    // CURRENT USER
    // ==========================================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        String userId = request.getHeader("X-User-Id"); // ✅ FIXED
        System.out.println(userId);
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
        System.out.println(request.toString());
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

            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // 🔐 true in production (HTTPS)
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60);

            response.addCookie(cookie);

            return ResponseEntity.ok(
                    Map.of("message", "Login successful")
            );

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(500).body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    // ==========================================
    // LOGOUT
    // ==========================================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
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
            @RequestBody UpdateUserSettingsRequest request
    ) {
        return authService.updateSettings(userId, request);
    }


}