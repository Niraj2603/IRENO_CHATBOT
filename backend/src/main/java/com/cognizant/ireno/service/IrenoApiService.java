package com.cognizant.ireno.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Service for communicating with IRENO API
 * Handles assets and outages data retrieval
 */
@Slf4j
@Service
public class IrenoApiService {

    @Value("${ireno.api.base-url}")
    private String irenoApiBaseUrl;

    @Value("${ireno.api.token}")
    private String irenoApiToken;

    @Value("${ireno.api.timeout:10000}")
    private int timeoutMs;

    private final RestTemplate restTemplate;

    public IrenoApiService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Get assets data from IRENO API
     */
    public Map<String, Object> getAssets() {
        log.info("🏗️ Retrieving assets data from IRENO API");
        
        try {
            String url = irenoApiBaseUrl + "/assets";
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            // For now, return mock data since we don't have real IRENO API
            // In production, uncomment the following line:
            // ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            
            return createMockAssetsData();
            
        } catch (ResourceAccessException e) {
            log.error("🔌 Cannot connect to IRENO API: {}", e.getMessage());
            return createErrorResponse("connection_error", "Unable to connect to IRENO API");
        } catch (HttpClientErrorException e) {
            log.error("❌ Client error calling IRENO API: {} - {}", e.getStatusCode(), e.getMessage());
            return createErrorResponse("client_error", "Client error: " + e.getStatusCode());
        } catch (HttpServerErrorException e) {
            log.error("🚨 Server error from IRENO API: {} - {}", e.getStatusCode(), e.getMessage());
            return createErrorResponse("server_error", "Server error: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("💥 Unexpected error calling IRENO API: {}", e.getMessage(), e);
            return createErrorResponse("unexpected_error", "Unexpected error occurred");
        }
    }

    /**
     * Get outages data from IRENO API
     */
    public Map<String, Object> getOutages() {
        log.info("⚡ Retrieving outages data from IRENO API");
        
        try {
            String url = irenoApiBaseUrl + "/outages";
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            // For now, return mock data since we don't have real IRENO API
            // In production, uncomment the following line:
            // ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            
            return createMockOutagesData();
            
        } catch (ResourceAccessException e) {
            log.error("🔌 Cannot connect to IRENO API: {}", e.getMessage());
            return createErrorResponse("connection_error", "Unable to connect to IRENO API");
        } catch (HttpClientErrorException e) {
            log.error("❌ Client error calling IRENO API: {} - {}", e.getStatusCode(), e.getMessage());
            return createErrorResponse("client_error", "Client error: " + e.getStatusCode());
        } catch (HttpServerErrorException e) {
            log.error("🚨 Server error from IRENO API: {} - {}", e.getStatusCode(), e.getMessage());
            return createErrorResponse("server_error", "Server error: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("💥 Unexpected error calling IRENO API: {}", e.getMessage(), e);
            return createErrorResponse("unexpected_error", "Unexpected error occurred");
        }
    }

    /**
     * Create HTTP headers for IRENO API requests
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + irenoApiToken);
        headers.set("User-Agent", "IRENO-Advisor-Backend/1.0");
        return headers;
    }

    /**
     * Create error response map
     */
    private Map<String, Object> createErrorResponse(String errorType, String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "error");
        errorResponse.put("errorType", errorType);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", LocalDateTime.now());
        return errorResponse;
    }

    /**
     * Create mock assets data for testing
     */
    private Map<String, Object> createMockAssetsData() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("timestamp", LocalDateTime.now());
        
        List<Map<String, Object>> assets = new ArrayList<>();
        
        // Mock transformer data
        Map<String, Object> transformer1 = new HashMap<>();
        transformer1.put("id", "T-001");
        transformer1.put("type", "Transformer");
        transformer1.put("location", "Manhattan Substation A");
        transformer1.put("status", "Operational");
        transformer1.put("capacity", "50 MVA");
        transformer1.put("load", "42 MVA");
        transformer1.put("utilization", 84);
        assets.add(transformer1);
        
        Map<String, Object> transformer2 = new HashMap<>();
        transformer2.put("id", "T-002");
        transformer2.put("type", "Transformer");
        transformer2.put("location", "Brooklyn Substation B");
        transformer2.put("status", "Maintenance");
        transformer2.put("capacity", "75 MVA");
        transformer2.put("load", "0 MVA");
        transformer2.put("utilization", 0);
        assets.add(transformer2);
        
        // Mock transmission line data
        Map<String, Object> line1 = new HashMap<>();
        line1.put("id", "L-001");
        line1.put("type", "Transmission Line");
        line1.put("location", "Manhattan to Brooklyn");
        line1.put("status", "Operational");
        line1.put("voltage", "345 kV");
        line1.put("current", "850 A");
        line1.put("capacity", "1000 A");
        assets.add(line1);
        
        response.put("assets", assets);
        response.put("totalAssets", assets.size());
        
        return response;
    }

    /**
     * Create mock outages data for testing
     */
    private Map<String, Object> createMockOutagesData() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("timestamp", LocalDateTime.now());
        
        List<Map<String, Object>> outages = new ArrayList<>();
        
        // Mock outage data
        Map<String, Object> outage1 = new HashMap<>();
        outage1.put("id", "OUT-001");
        outage1.put("type", "Planned Maintenance");
        outage1.put("location", "Brooklyn Substation B");
        outage1.put("affectedAssets", Arrays.asList("T-002", "L-003"));
        outage1.put("startTime", LocalDateTime.now().minusHours(2));
        outage1.put("estimatedEndTime", LocalDateTime.now().plusHours(4));
        outage1.put("customersAffected", 0);
        outage1.put("priority", "Low");
        outages.add(outage1);
        
        Map<String, Object> outage2 = new HashMap<>();
        outage2.put("id", "OUT-002");
        outage2.put("type", "Equipment Failure");
        outage2.put("location", "Queens Distribution");
        outage2.put("affectedAssets", Arrays.asList("D-045", "D-046"));
        outage2.put("startTime", LocalDateTime.now().minusMinutes(30));
        outage2.put("estimatedEndTime", LocalDateTime.now().plusHours(2));
        outage2.put("customersAffected", 1250);
        outage2.put("priority", "High");
        outages.add(outage2);
        
        response.put("outages", outages);
        response.put("totalOutages", outages.size());
        response.put("criticalOutages", 1);
        response.put("customersAffected", 1250);
        
        return response;
    }

    /**
     * Test connection to IRENO API
     */
    public boolean testConnection() {
        try {
            String url = irenoApiBaseUrl + "/health";
            HttpHeaders headers = createHeaders();
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            // For mock testing, always return true
            // In production, uncomment the following lines:
            // ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            // return response.getStatusCode() == HttpStatus.OK;
            
            return true;
            
        } catch (Exception e) {
            log.warn("⚠️ IRENO API health check failed: {}", e.getMessage());
            return false;
        }
    }
}