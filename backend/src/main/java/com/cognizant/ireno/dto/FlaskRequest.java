package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Request DTO for Flask AI Server
 * Contains the user query to be processed by GPT
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlaskRequest {
    
    @JsonProperty("prompt")
    private String prompt; // User's query to send to Azure OpenAI
} 