package com.example.chatbackend.controller;

import com.example.chatbackend.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

record LoginRequest(@NotBlank String username, @NotBlank String password) {}
record LoginResponse(String token) {}

@Validated
@RestController
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        // Fixed test user
        if ("test".equals(request.username()) && "password123".equals(request.password())) {
            String token = jwtService.generateToken(request.username());
            return ResponseEntity.ok(new LoginResponse(token));
        }
        return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid credentials"));
    }
}