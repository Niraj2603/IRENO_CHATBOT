package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for login responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("message")
    private String message;
}