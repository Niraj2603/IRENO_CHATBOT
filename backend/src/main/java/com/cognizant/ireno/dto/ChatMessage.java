package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for Chat Messages
 * Used for communication between frontend and backend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    
    @JsonProperty("type")
    private String type; // "user" or "bot"
    
    @JsonProperty("message")
    @NotBlank(message = "Message cannot be empty")
    private String message;
    
    @JsonProperty("timestamp")
    private String timestamp;
    
    @JsonProperty("sessionId")
    private String sessionId; // Optional: to track different chat sessions
} 