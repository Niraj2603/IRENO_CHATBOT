package com.example.chatbackend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
public class IrenoController {

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${IRENO_API_BASE_URL:}")
    private String irenoBaseUrl;

    @Value("${IRENO_API_TOKEN:}")
    private String irenoToken;

    @GetMapping("/assets")
    public ResponseEntity<?> getAssets() {
        if (irenoBaseUrl == null || irenoBaseUrl.isBlank()) {
            return ResponseEntity.ok(Map.of(
                    "assets", List.of(
                            Map.of("id", "asset-1", "name", "Transformer A", "status", "online"),
                            Map.of("id", "asset-2", "name", "Line B", "status", "maintenance")
                    )
            ));
        }
        return proxy("/assets");
    }

    @GetMapping("/outages")
    public ResponseEntity<?> getOutages() {
        if (irenoBaseUrl == null || irenoBaseUrl.isBlank()) {
            return ResponseEntity.ok(Map.of(
                    "outages", List.of(
                            Map.of("id", "outage-1", "assetId", "asset-2", "severity", "high")
                    )
            ));
        }
        return proxy("/outages");
    }

    private ResponseEntity<?> proxy(String path) {
        String url = irenoBaseUrl.endsWith("/") ? irenoBaseUrl.substring(0, irenoBaseUrl.length()-1) : irenoBaseUrl;
        url = url + path;
        Request.Builder builder = new Request.Builder().url(url);
        if (irenoToken != null && !irenoToken.isBlank()) {
            builder.header("Authorization", "Bearer " + irenoToken);
        }
        try (Response response = httpClient.newCall(builder.get().build()).execute()) {
            if (!response.isSuccessful()) {
                return ResponseEntity.status(502).body(Map.of("error", "IRENO API error", "status", response.code()));
            }
            String bodyStr = response.body() != null ? response.body().string() : "{}";
            JsonNode node = objectMapper.readTree(bodyStr);
            return ResponseEntity.ok(node);
        } catch (IOException e) {
            return ResponseEntity.status(502).body(Map.of("error", e.getMessage()));
        }
    }
}