package com.example.chatbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PythonLlmClient {
    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String baseUrl;

    public PythonLlmClient(@Value("${python.service.url}") String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String generate(String prompt) throws IOException {
        String url = baseUrl.endsWith("/") ? baseUrl + "generate" : baseUrl + "/generate";
        MediaType jsonMediaType = MediaType.parse("application/json; charset=utf-8");
        String bodyStr = objectMapper.createObjectNode().put("prompt", prompt).toString();
        RequestBody body = RequestBody.create(bodyStr, jsonMediaType);
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Python service error: HTTP " + response.code());
            }
            String respStr = response.body() != null ? response.body().string() : "{}";
            JsonNode node = objectMapper.readTree(respStr);
            JsonNode respNode = node.get("response");
            if (respNode == null || respNode.isNull()) {
                throw new IOException("Python service returned no 'response' field");
            }
            return respNode.asText();
        }
    }
}