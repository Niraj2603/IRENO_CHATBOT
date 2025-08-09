package com.cognizant.ireno.controller;

import com.cognizant.ireno.dto.*;
import com.cognizant.ireno.service.ChatHistoryService;
import com.cognizant.ireno.service.FlaskQueryService;
import com.cognizant.ireno.service.IrenoApiService;
import com.cognizant.ireno.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Main REST Controller for IRENO Backend API
 * Provides endpoints for chat, history, assets, outages, and authentication
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class IrenoApiController {

    @Autowired
    private FlaskQueryService flaskQueryService;

    @Autowired
    private ChatHistoryService chatHistoryService;

    @Autowired
    private IrenoApiService irenoApiService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * POST /chat - Main chat endpoint
     * Accepts user query, calls Python LLM service, returns response
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request, HttpServletRequest httpRequest) {
        log.info("💬 Chat request received: {}", request.getQuery().substring(0, Math.min(50, request.getQuery().length())));
        
        // Validate token
        String token = extractToken(httpRequest);
        if (token == null || !jwtUtil.validateToken(token)) {
            log.warn("🔒 Unauthorized chat request - invalid token");
            return ResponseEntity.status(401).build();
        }
        
        long startTime = System.currentTimeMillis();
        
        try {
            // Call Python LLM service
            String aiResponse = flaskQueryService.queryFlaskAI(request.getQuery(), "api-session");
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            // Create response
            ChatResponse response = new ChatResponse(
                request.getQuery(),
                aiResponse,
                LocalDateTime.now(),
                processingTime
            );
            
            // Save to history
            chatHistoryService.addChatEntry(request.getQuery(), aiResponse, processingTime);
            
            log.info("✅ Chat processed successfully in {}ms", processingTime);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Chat processing failed: {}", e.getMessage(), e);
            
            ChatResponse errorResponse = new ChatResponse(
                request.getQuery(),
                "I apologize, but I'm experiencing technical difficulties. Please try again later.",
                LocalDateTime.now(),
                System.currentTimeMillis() - startTime
            );
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * GET /history - Get chat history
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(
            @RequestParam(defaultValue = "50") int limit,
            HttpServletRequest httpRequest) {
        
        // Validate token
        String token = extractToken(httpRequest);
        if (token == null || !jwtUtil.validateToken(token)) {
            log.warn("🔒 Unauthorized history request - invalid token");
            return ResponseEntity.status(401).build();
        }
        
        try {
            List<ChatHistoryEntry> history = chatHistoryService.getRecentHistory(limit);
            ChatHistoryService.ChatHistoryStats stats = chatHistoryService.getStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("history", history);
            response.put("stats", Map.of(
                "totalEntries", stats.totalEntries,
                "avgProcessingTimeMs", stats.avgProcessingTimeMs,
                "earliestEntry", stats.earliestEntry,
                "latestEntry", stats.latestEntry
            ));
            response.put("timestamp", LocalDateTime.now());
            
            log.info("📋 Retrieved {} history entries", history.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ History retrieval failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * GET /assets - Get assets data from IRENO API
     */
    @GetMapping("/assets")
    public ResponseEntity<Map<String, Object>> getAssets(HttpServletRequest httpRequest) {
        
        // Validate token
        String token = extractToken(httpRequest);
        if (token == null || !jwtUtil.validateToken(token)) {
            log.warn("🔒 Unauthorized assets request - invalid token");
            return ResponseEntity.status(401).build();
        }
        
        try {
            Map<String, Object> assetsData = irenoApiService.getAssets();
            log.info("🏗️ Retrieved assets data successfully");
            return ResponseEntity.ok(assetsData);
            
        } catch (Exception e) {
            log.error("❌ Assets retrieval failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * GET /outages - Get outages data from IRENO API
     */
    @GetMapping("/outages")
    public ResponseEntity<Map<String, Object>> getOutages(HttpServletRequest httpRequest) {
        
        // Validate token
        String token = extractToken(httpRequest);
        if (token == null || !jwtUtil.validateToken(token)) {
            log.warn("🔒 Unauthorized outages request - invalid token");
            return ResponseEntity.status(401).build();
        }
        
        try {
            Map<String, Object> outagesData = irenoApiService.getOutages();
            log.info("⚡ Retrieved outages data successfully");
            return ResponseEntity.ok(outagesData);
            
        } catch (Exception e) {
            log.error("❌ Outages retrieval failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * POST /login - Authenticate user and return JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("🔐 Login attempt for user: {}", request.getUsername());
        
        try {
            // Simple hardcoded authentication for demo
            // In production, use proper user authentication service
            if ("admin".equals(request.getUsername()) && "password".equals(request.getPassword())) {
                String token = jwtUtil.generateToken(request.getUsername());
                
                LoginResponse response = new LoginResponse(
                    token,
                    request.getUsername(),
                    "Login successful"
                );
                
                log.info("✅ Login successful for user: {}", request.getUsername());
                return ResponseEntity.ok(response);
                
            } else {
                log.warn("❌ Login failed for user: {} - invalid credentials", request.getUsername());
                
                LoginResponse response = new LoginResponse(
                    null,
                    null,
                    "Invalid username or password"
                );
                
                return ResponseEntity.status(401).body(response);
            }
            
        } catch (Exception e) {
            log.error("💥 Login processing failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * DELETE /history - Clear chat history
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory(HttpServletRequest httpRequest) {
        
        // Validate token
        String token = extractToken(httpRequest);
        if (token == null || !jwtUtil.validateToken(token)) {
            log.warn("🔒 Unauthorized history clear request - invalid token");
            return ResponseEntity.status(401).build();
        }
        
        try {
            chatHistoryService.clearHistory();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Chat history cleared successfully");
            response.put("timestamp", LocalDateTime.now());
            
            log.info("🗑️ Chat history cleared");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ History clearing failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Extract JWT token from Authorization header
     */
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}