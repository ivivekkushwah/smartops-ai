package com.smartops.auth.security;



import com.smartops.auth.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private Key signingKey;

    @PostConstruct
    public void init() {
        String SECRET_KEY = "mysecretkeymysecretkeymysecretkey123456";
        this.signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ==========================================
    // ✅ GENERATE TOKEN (USER ID BASED)
    // ==========================================
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId())) // ✅ MAIN IDENTITY
                .claim("email", user.getEmail()) // optional
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(signingKey)
                .compact();
    }

    // ==========================================
    // ✅ EXTRACT CLAIMS
    // ==========================================
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ==========================================
    // ✅ PRIMARY: USER ID
    // ==========================================
    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ==========================================
    // ✅ OPTIONAL CLAIMS
    // ==========================================
    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // ==========================================
    // ✅ EXPIRATION
    // ==========================================
    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ==========================================
    // ✅ VALIDATION
    // ==========================================
    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }


}