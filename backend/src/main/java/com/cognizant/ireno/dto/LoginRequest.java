package com.cognizant.ireno.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for login requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("password")
    private String password;
}