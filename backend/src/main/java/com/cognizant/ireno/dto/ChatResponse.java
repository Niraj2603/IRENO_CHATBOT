package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * Response DTO for chat endpoint
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    @JsonProperty("query")
    private String query; // Original user query
    
    @JsonProperty("response")
    private String response; // AI-generated response
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp; // When the response was generated
    
    @JsonProperty("processing_time_ms")
    private Long processingTimeMs; // Processing time in milliseconds
}