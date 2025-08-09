package com.example.chatbackend.model;

import java.time.Instant;

public class ChatModels {
    public static class ChatRequest {
        private String query;
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
    }

    public static class ChatResponse {
        private String query;
        private String response;
        public ChatResponse() {}
        public ChatResponse(String query, String response) {
            this.query = query;
            this.response = response;
        }
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
    }

    public static class HistoryEntry {
        private Instant timestamp;
        private String query;
        private String response;
        public HistoryEntry() {}
        public HistoryEntry(Instant timestamp, String query, String response) {
            this.timestamp = timestamp;
            this.query = query;
            this.response = response;
        }
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
    }
}