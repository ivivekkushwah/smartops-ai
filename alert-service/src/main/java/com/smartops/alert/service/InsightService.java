package com.smartops.alert.service;

import com.smartops.alert.model.Insight;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InsightService {

    private final List<Insight> insights = new ArrayList<>();
    private final InsightPublisher publisher;
    // ✅ Generate dummy insights (replace with real logic later)
    public List<Insight> getInsights() {
        if (insights.isEmpty()) {
            insights.add(generateInsight("AUTH-SERVICE latency high", "CRITICAL"));
            insights.add(generateInsight("CPU usage spike detected", "WARNING"));
            insights.add(generateInsight("System stable", "INFO"));
        }
        return insights;
    }

    public Insight generateInsight(String message, String severity) {
        Insight insight = Insight.builder()
                .id(UUID.randomUUID().toString())
                .type("ANOMALY")
                .message(message)
                .severity(severity)
                .timestamp(LocalDateTime.now())
                .build();

        insights.add(0, insight);

        // 🔴 send to WebSocket
        publisher.publishInsight(insight);

        return insight;
    }
}