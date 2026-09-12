package com.smartops.gateway.security;

import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtGatewayFilter implements GlobalFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtGatewayFilter.class);
    private final JwtUtil jwtUtil;

    public JwtGatewayFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // OPTIONS
        if ("OPTIONS".equals(request.getMethod().name())) {
            return chain.filter(exchange);
        }

        // Public endpoints
        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
            return chain.filter(exchange);
        }

        HttpCookie cookie = request.getCookies().getFirst("token");

        try {
            if (cookie != null) {
                String userId = jwtUtil.extractUserId(cookie.getValue());

                ServerHttpRequest modifiedRequest = request.mutate()
                        .headers(headers -> headers.remove("X-User-Id"))
                        .header("X-User-Id", userId)
                        .build();
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            }
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Rejected request with invalid or expired JWT for path {}", path);
        } catch (Exception e) {
            log.error("Unexpected JWT processing failure for path {}", path, e);
        }
        // Every route after the public login/register endpoints is authenticated.
        // Do not forward an unauthenticated request with a caller-controlled
        // X-User-Id header to downstream services.
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

}
