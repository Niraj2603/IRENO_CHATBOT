package com.example.chatbackend.service;

import com.example.chatbackend.model.ChatModels.HistoryEntry;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class HistoryService {
    private final CopyOnWriteArrayList<HistoryEntry> history = new CopyOnWriteArrayList<>();

    public void add(String query, String response) {
        history.add(new HistoryEntry(Instant.now(), query, response));
    }

    public List<HistoryEntry> getAll() {
        return List.copyOf(history);
    }
}