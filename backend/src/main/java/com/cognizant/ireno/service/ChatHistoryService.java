package com.cognizant.ireno.service;

import com.cognizant.ireno.dto.ChatHistoryEntry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Service for managing chat history in memory
 */
@Slf4j
@Service
public class ChatHistoryService {

    // Thread-safe list for storing chat history
    private final List<ChatHistoryEntry> chatHistory = new CopyOnWriteArrayList<>();

    /**
     * Add a new chat entry to history
     */
    public ChatHistoryEntry addChatEntry(String query, String response, Long processingTimeMs) {
        ChatHistoryEntry entry = new ChatHistoryEntry(
                UUID.randomUUID().toString(),
                query,
                response,
                LocalDateTime.now(),
                processingTimeMs
        );
        
        chatHistory.add(entry);
        log.info("💾 Added chat entry to history: ID={}, Query length={}", 
                entry.getId(), query.length());
        
        return entry;
    }

    /**
     * Get all chat history entries
     */
    public List<ChatHistoryEntry> getAllHistory() {
        log.info("📋 Retrieving {} chat history entries", chatHistory.size());
        return new ArrayList<>(chatHistory);
    }

    /**
     * Get recent chat history (last N entries)
     */
    public List<ChatHistoryEntry> getRecentHistory(int limit) {
        int size = chatHistory.size();
        int fromIndex = Math.max(0, size - limit);
        
        List<ChatHistoryEntry> recent = new ArrayList<>(chatHistory.subList(fromIndex, size));
        log.info("📋 Retrieving {} recent chat entries (last {} of {})", 
                recent.size(), limit, size);
        
        return recent;
    }

    /**
     * Clear all chat history
     */
    public void clearHistory() {
        int previousSize = chatHistory.size();
        chatHistory.clear();
        log.info("🗑️ Cleared {} chat history entries", previousSize);
    }

    /**
     * Get chat history statistics
     */
    public ChatHistoryStats getStats() {
        if (chatHistory.isEmpty()) {
            return new ChatHistoryStats(0, 0, 0, null, null);
        }

        long totalProcessingTime = chatHistory.stream()
                .mapToLong(entry -> entry.getProcessingTimeMs() != null ? entry.getProcessingTimeMs() : 0)
                .sum();
        
        double avgProcessingTime = (double) totalProcessingTime / chatHistory.size();
        
        LocalDateTime earliest = chatHistory.get(0).getTimestamp();
        LocalDateTime latest = chatHistory.get(chatHistory.size() - 1).getTimestamp();

        return new ChatHistoryStats(
                chatHistory.size(),
                totalProcessingTime,
                avgProcessingTime,
                earliest,
                latest
        );
    }

    /**
     * Statistics class for chat history
     */
    public static class ChatHistoryStats {
        public final int totalEntries;
        public final long totalProcessingTimeMs;
        public final double avgProcessingTimeMs;
        public final LocalDateTime earliestEntry;
        public final LocalDateTime latestEntry;

        public ChatHistoryStats(int totalEntries, long totalProcessingTimeMs, 
                               double avgProcessingTimeMs, LocalDateTime earliestEntry, 
                               LocalDateTime latestEntry) {
            this.totalEntries = totalEntries;
            this.totalProcessingTimeMs = totalProcessingTimeMs;
            this.avgProcessingTimeMs = avgProcessingTimeMs;
            this.earliestEntry = earliestEntry;
            this.latestEntry = latestEntry;
        }
    }
}