package com.cognizant.ireno.controller;

import com.cognizant.ireno.dto.ChatMessage;
import com.cognizant.ireno.service.FlaskQueryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;

/**
 * WebSocket Handler for Chat Communications
 * 
 * Handles real-time messaging between React frontend and Spring Boot backend.
 * Processes user queries and forwards them to Flask AI server.
 */
@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private FlaskQueryService flaskQueryService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("🔗 WebSocket connection established with session: {}", session.getId());
        
        // Send welcome message to frontend
        ChatMessage welcomeMessage = new ChatMessage(
            "bot", 
            "Hello! I'm IRENO AI Assistant. I can help you with grid operations, meter readings, alerts, and system monitoring. How can I assist you today?",
            LocalDateTime.now().format(timeFormatter),
            session.getId()
        );
        
        sendMessage(session, welcomeMessage);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            log.info("📨 Received message from session {}: {}", session.getId(), message.getPayload());
            
            // Parse incoming message
            ChatMessage chatMessage = objectMapper.readValue(message.getPayload(), ChatMessage.class);
            
            // Validate message
            if (chatMessage.getMessage() == null || chatMessage.getMessage().trim().isEmpty()) {
                sendErrorMessage(session, "Message cannot be empty");
                return;
            }

            // Process user query asynchronously to avoid blocking WebSocket
            CompletableFuture.supplyAsync(() -> {
                try {
                    // Send typing indicator
                    sendTypingIndicator(session, true);
                    
                    // Call Flask AI service
                    String aiResponse = flaskQueryService.queryFlaskAI(chatMessage.getMessage(), session.getId());
                    
                    // Send AI response back to frontend
                    ChatMessage botResponse = new ChatMessage(
                        "bot",
                        aiResponse,
                        LocalDateTime.now().format(timeFormatter),
                        session.getId()
                    );
                    
                    sendMessage(session, botResponse);
                    
                } catch (Exception e) {
                    log.error("❌ Error processing message: {}", e.getMessage(), e);
                    sendErrorMessage(session, "Unable to process your request at the moment. Please try again later.");
                } finally {
                    // Stop typing indicator
                    sendTypingIndicator(session, false);
                }
                return null;
            });

        } catch (Exception e) {
            log.error("❌ Error handling WebSocket message: {}", e.getMessage(), e);
            sendErrorMessage(session, "Error processing your message");
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("🚨 WebSocket transport error for session {}: {}", session.getId(), exception.getMessage());
        sendErrorMessage(session, "Connection error occurred");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("🔌 WebSocket connection closed for session {}: {}", session.getId(), status.toString());
    }

    /**
     * Send a chat message to the WebSocket session
     */
    private void sendMessage(WebSocketSession session, ChatMessage message) {
        try {
            if (session.isOpen()) {
                String json = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(json));
                log.info("📤 Sent message to session {}: {}", session.getId(), message.getMessage().substring(0, Math.min(50, message.getMessage().length())));
            }
        } catch (Exception e) {
            log.error("❌ Error sending message: {}", e.getMessage(), e);
        }
    }

    /**
     * Send an error message to the frontend
     */
    private void sendErrorMessage(WebSocketSession session, String error) {
        ChatMessage errorMessage = new ChatMessage(
            "bot",
            error,
            LocalDateTime.now().format(timeFormatter),
            session.getId()
        );
        sendMessage(session, errorMessage);
    }

    /**
     * Send typing indicator to frontend
     */
    private void sendTypingIndicator(WebSocketSession session, boolean isTyping) {
        try {
            if (session.isOpen()) {
                String typingJson = String.format("{\"type\": \"typing\", \"isTyping\": %b}", isTyping);
                session.sendMessage(new TextMessage(typingJson));
            }
        } catch (Exception e) {
            log.error("❌ Error sending typing indicator: {}", e.getMessage(), e);
        }
    }
} 