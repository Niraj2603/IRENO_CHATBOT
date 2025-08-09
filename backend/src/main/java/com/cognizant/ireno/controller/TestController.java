package com.cognizant.ireno.controller;

import com.cognizant.ireno.service.FlaskQueryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for Testing IRENO Backend
 * 
 * Provides endpoints to test the Flask AI integration without using WebSocket.
 * Useful for development and debugging purposes.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class TestController {

    @Autowired
    private FlaskQueryService flaskQueryService;

    /**
     * Test endpoint to query Flask AI server directly
     * 
     * Example: GET /api/test?query=Show me critical alerts in Brooklyn
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testFlaskQuery(@RequestParam String query) {
        log.info("🧪 Test query received: {}", query);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            long startTime = System.currentTimeMillis();
            
            // Call Flask AI service
            String aiResponse = flaskQueryService.queryFlaskAI(query, "test-session");
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            response.put("status", "success");
            response.put("query", query);
            response.put("response", aiResponse);
            response.put("processingTimeMs", processingTime);
            response.put("timestamp", LocalDateTime.now().toString());
            
            log.info("✅ Test query processed successfully in {}ms", processingTime);
            
        } catch (Exception e) {
            log.error("❌ Test query failed: {}", e.getMessage(), e);
            response.put("status", "error");
            response.put("error", e.getMessage());
            response.put("timestamp", LocalDateTime.now().toString());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint for the backend
     * Also includes check for Python Flask service and IRENO API
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Check Flask server connection
            boolean flaskOnline = flaskQueryService.testFlaskConnection();
            String flaskStatus = flaskQueryService.getServerStatus();
            
            health.put("status", "UP");
            health.put("backend", "Spring Boot - Online");
            health.put("flaskServer", flaskStatus);
            health.put("flaskOnline", flaskOnline);
            health.put("timestamp", LocalDateTime.now().toString());
            health.put("version", "1.0.0");
            
            log.info("💚 Health check passed - Flask: {}", flaskOnline ? "Online" : "Offline");
            
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            health.put("timestamp", LocalDateTime.now().toString());
            
            log.error("❤️‍🩹 Health check failed: {}", e.getMessage());
        }
        
        return ResponseEntity.ok(health);
    }

    /**
     * System status endpoint
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> systemStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("application", "IRENO Advisor Backend");
        status.put("version", "1.0.0");
        status.put("springBootVersion", "3.2.1");
        status.put("javaVersion", System.getProperty("java.version"));
        status.put("uptime", LocalDateTime.now().toString());
        status.put("endpoints", Map.of(
            "websocket", "/chat",
            "health", "/api/health",
            "test", "/api/test?query=your_question",
            "status", "/api/status"
        ));
        
        return ResponseEntity.ok(status);
    }

    /**
     * Echo endpoint for basic connectivity testing
     */
    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> payload) {
        log.info("🔊 Echo request received: {}", payload);
        
        Map<String, Object> response = new HashMap<>();
        response.put("echo", payload);
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Echo successful from IRENO Backend");
        
        return ResponseEntity.ok(response);
    }
} 