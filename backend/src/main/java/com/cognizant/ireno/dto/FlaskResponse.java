package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Response DTO from Flask AI Server
 * Contains the AI-generated response and metadata
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlaskResponse {
    
    @JsonProperty("response")
    private String response; // AI-generated response
    
    @JsonProperty("processing_time")
    private Double processingTime; // Time taken by AI to process
    
    @JsonProperty("error")
    private String error; // Error message if any
} 