package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * DTO for chat history entries
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistoryEntry {
    
    @JsonProperty("id")
    private String id; // Unique identifier
    
    @JsonProperty("query")
    private String query; // User's original query
    
    @JsonProperty("response")
    private String response; // AI response
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp; // When the conversation occurred
    
    @JsonProperty("processing_time_ms")
    private Long processingTimeMs; // How long it took to process
}