package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request DTO for chat endpoint
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    @JsonProperty("query")
    private String query; // User's query
}