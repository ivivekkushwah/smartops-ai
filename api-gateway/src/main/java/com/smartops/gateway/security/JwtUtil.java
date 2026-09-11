package com.smartops.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // 🔑 Signing key
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ==========================================
    // 🔥 GENERATE TOKEN (NOW USING USER ID)
    // ==========================================
    public String generateToken(String userId, String email, String role) {
        return Jwts.builder()
                .setSubject(userId) // ✅ MAIN IDENTITY
                .claim("email", email) // optional
                .claim("role", role)   // optional
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ==========================================
    // 🔥 EXTRACT USER ID
    // ==========================================
    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ==========================================
    // 🔥 OPTIONAL CLAIMS
    // ==========================================
    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // ==========================================
    // 🔥 EXPIRATION
    // ==========================================
    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ==========================================
    // 🔥 VALIDATION
    // ==========================================
    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ==========================================
    // 🔥 CORE PARSER
    // ==========================================
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
