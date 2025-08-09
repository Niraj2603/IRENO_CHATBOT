package com.cognizant.ireno.service;

import com.cognizant.ireno.dto.FlaskRequest;
import com.cognizant.ireno.dto.FlaskResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.time.Duration;
import java.time.Instant;

/**
 * Service for communicating with Flask AI Server
 * 
 * Handles REST API calls to the Python Flask server that processes
 * GPT queries and returns AI-generated responses.
 */
@Slf4j
@Service
public class FlaskQueryService {

    @Value("${flask.server.url:http://localhost:5000}")
    private String flaskServerUrl;

    @Value("${flask.server.endpoint:/llm-query}")
    private String flaskEndpoint;

    @Value("${flask.server.timeout:30000}")
    private int timeoutMs;

    private final RestTemplate restTemplate;

    public FlaskQueryService() {
        this.restTemplate = new RestTemplate();
        // Set timeouts for the RestTemplate
        this.restTemplate.getRequestFactory();
    }

    /**
     * Query the Flask AI server with user input
     * 
     * @param userQuery The user's query
     * @param sessionId Session identifier for context
     * @return AI-generated response
     */
    public String queryFlaskAI(String userQuery, String sessionId) {
        Instant startTime = Instant.now();
        
        try {
            log.info("🤖 Sending query to Flask AI server: {}", userQuery.substring(0, Math.min(50, userQuery.length())));
            
            // Prepare request
            FlaskRequest request = new FlaskRequest(userQuery);
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "IRENO-Backend/1.0");
            
            HttpEntity<FlaskRequest> entity = new HttpEntity<>(request, headers);
            
            // Make REST call to Flask server
            String fullUrl = flaskServerUrl + flaskEndpoint;
            log.info("📡 Calling Flask server at: {}", fullUrl);
            
            ResponseEntity<FlaskResponse> response = restTemplate.exchange(
                fullUrl,
                HttpMethod.POST,
                entity,
                FlaskResponse.class
            );
            
            Duration processingTime = Duration.between(startTime, Instant.now());
            log.info("✅ Received response from Flask in {}ms", processingTime.toMillis());
            
            // Process response
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                FlaskResponse flaskResponse = response.getBody();
                
                if (flaskResponse.getResponse() != null) {
                    log.info("🎯 Successfully processed AI query");
                    return flaskResponse.getResponse();
                } else if (flaskResponse.getError() != null) {
                    log.warn("⚠️ Flask server returned error: {}", flaskResponse.getError());
                    return "I apologize, but I encountered an issue processing your request. Please try rephrasing your question.";
                } else {
                    log.error("❌ Invalid response structure from Flask server");
                    return getFallbackResponse("server_error");
                }
            } else {
                log.error("❌ Invalid response from Flask server: {}", response.getStatusCode());
                return getFallbackResponse("server_error");
            }
            
        } catch (ResourceAccessException e) {
            log.error("🔌 Cannot connect to Flask server: {}", e.getMessage());
            return getFallbackResponse("connection_error");
            
        } catch (HttpClientErrorException e) {
            log.error("❌ Client error calling Flask server: {} - {}", e.getStatusCode(), e.getMessage());
            return getFallbackResponse("client_error");
            
        } catch (HttpServerErrorException e) {
            log.error("🚨 Server error from Flask: {} - {}", e.getStatusCode(), e.getMessage());
            return getFallbackResponse("server_error");
            
        } catch (Exception e) {
            log.error("💥 Unexpected error calling Flask server: {}", e.getMessage(), e);
            return getFallbackResponse("unexpected_error");
        }
    }

    /**
     * Test connection to Flask server
     * 
     * @return true if Flask server is reachable
     */
    public boolean testFlaskConnection() {
        try {
            String testUrl = flaskServerUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(testUrl, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.warn("⚠️ Flask health check failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get fallback response based on error type
     */
    private String getFallbackResponse(String errorType) {
        return switch (errorType) {
            case "connection_error" -> 
                "🔌 I'm unable to connect to the AI service right now. Please check if the Flask server is running and try again.";
            case "timeout_error" -> 
                "⏱️ The AI service is taking longer than expected to respond. Please try a simpler query or try again later.";
            case "server_error" -> 
                "🚨 The AI service encountered an internal error. Our team has been notified. Please try again later.";
            case "client_error" -> 
                "📝 There was an issue with your request format. Please try rephrasing your question.";
            default -> 
                "❌ I'm experiencing technical difficulties. Please try again later or contact support if the issue persists.";
        };
    }

    /**
     * Get server status information
     */
    public String getServerStatus() {
        boolean isOnline = testFlaskConnection();
        return String.format("Flask AI Server: %s (%s)", 
            isOnline ? "Online" : "Offline", 
            flaskServerUrl);
    }
} 