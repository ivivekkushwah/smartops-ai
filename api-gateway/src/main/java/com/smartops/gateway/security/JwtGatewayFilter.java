package com.smartops.gateway.security;

import jakarta.ws.rs.HttpMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
@Component
public class JwtGatewayFilter implements GlobalFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        System.out.println("👉 Incoming Request: " + path);

        // OPTIONS
        if ("OPTIONS".equals(request.getMethod().name())) {
            System.out.println("✅ OPTIONS request allowed");
            return chain.filter(exchange);
        }

        // Public endpoints
        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
            System.out.println("✅ Public endpoint allowed: " + path);
            return chain.filter(exchange);
        }

        HttpCookie cookie = request.getCookies().getFirst("token");

        if (cookie == null) {
            System.out.println("❌ No token cookie found");
        } else {
            System.out.println("✅ Token found: " + cookie.getValue());
        }

        try {
            if (cookie != null) {
                String userId = jwtUtil.extractUserId(cookie.getValue());
                System.out.println("✅ Extracted userId: " + userId);

                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", userId)
                        .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            }
        } catch (Exception e) {
            System.out.println("❌ JWT ERROR: " + e.getMessage());
        }
        System.out.println("🔥 JWT FILTER HIT");
        System.out.println("PATH: " + path);
        System.out.println("COOKIE: " + cookie);

        System.out.println("➡️ Forwarding request WITHOUT JWT");
        return chain.filter(exchange);
    }

}

