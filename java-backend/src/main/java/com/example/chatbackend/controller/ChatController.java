package com.example.chatbackend.controller;

import com.example.chatbackend.model.ChatModels.ChatRequest;
import com.example.chatbackend.model.ChatModels.ChatResponse;
import com.example.chatbackend.service.HistoryService;
import com.example.chatbackend.service.PythonLlmClient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
public class ChatController {

    private final PythonLlmClient pythonLlmClient;
    private final HistoryService historyService;

    public ChatController(PythonLlmClient pythonLlmClient, HistoryService historyService) {
        this.pythonLlmClient = pythonLlmClient;
        this.historyService = historyService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest request) {
        try {
            String query = request.getQuery();
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "Field 'query' is required"));
            }
            String response = pythonLlmClient.generate(query);
            historyService.add(query, response);
            return ResponseEntity.ok(new ChatResponse(query, response));
        } catch (Exception ex) {
            return ResponseEntity.status(502).body(java.util.Map.of("error", ex.getMessage()));
        }
    }
}