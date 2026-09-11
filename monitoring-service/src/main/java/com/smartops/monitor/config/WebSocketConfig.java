package com.smartops.monitor.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry config
    ) {

        config.enableSimpleBroker(
                "/topic"
        );

        config.setApplicationDestinationPrefixes(
                "/app"
        );
    }

    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {

        registry.addEndpoint("/monitor-ws")
                .addInterceptors(new AuthenticatedHandshakeInterceptor())
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(
            org.springframework.messaging.simp.config.ChannelRegistration registration
    ) {
        registration.interceptors(new UserDestinationInterceptor());
    }

    private static class AuthenticatedHandshakeInterceptor implements HandshakeInterceptor {
        @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                       WebSocketHandler wsHandler, Map<String, Object> attributes) {
            String userId = request.getHeaders().getFirst("X-User-Id");
            if (userId == null || userId.isBlank()) return false;
            attributes.put("userId", userId);
            return true;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Exception exception) { }
    }

    private static class UserDestinationInterceptor implements ChannelInterceptor {
        @Override
        public Message<?> preSend(Message<?> message, MessageChannel channel) {
            StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
            if (accessor.getCommand() != StompCommand.SUBSCRIBE) return message;
            Map<String, Object> attributes = accessor.getSessionAttributes();
            String userId = attributes == null ? null : (String) attributes.get("userId");
            String destination = accessor.getDestination();
            return userId != null && destination != null && destination.equals("/topic/logs/" + userId)
                    ? message : null;
        }
    }
}
