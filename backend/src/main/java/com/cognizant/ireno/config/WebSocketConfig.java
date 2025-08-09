package com.cognizant.ireno.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import com.cognizant.ireno.controller.ChatWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * WebSocket Configuration for IRENO Advisor
 * 
 * Configures WebSocket endpoints and enables CORS for React frontend.
 * Registers the chat handler at /chat endpoint.
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private ChatWebSocketHandler chatWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Register WebSocket handler for chat endpoint
        registry.addHandler(chatWebSocketHandler, "/chat")
                .setAllowedOrigins("http://localhost:3000", "http://127.0.0.1:3000") // React frontend
                .withSockJS(); // Enable SockJS fallback for browsers that don't support WebSocket
    }
} 