package com.smartops.insightservice.service;

import com.smartops.common.event.AlertEvent;
import com.smartops.insightservice.model.Insight;
import com.smartops.insightservice.repository.InsightRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InsightService {

    private final InsightRepository repository;
    private final GeminiService geminiService;

    public Insight saveInsight(AlertEvent event) {

        String prompt = """
                You are a Site Reliability Engineer.

                Analyze the following alert.

                Service: %s
                Severity: %s
                Title: %s
                Message: %s

                Return ONLY valid JSON.

                {
                  "severity":"",
                  "summary":"",
                  "rootCause":"",
                  "impact":"",
                  "recommendation":"",
                  "confidence":0
                }
                """.formatted(
                event.getServiceName(),
                event.getSeverity(),
                event.getTitle(),
                event.getMessage()
        );

        String aiResponse;

        try {
            aiResponse = geminiService.generateInsight(prompt);
        } catch (Exception e) {

            log.error("Gemini failed", e);

            aiResponse = """
        AI analysis unavailable.
        Reason: Gemini API rate limit exceeded.
        """;
        }

        Insight insight = Insight.builder()
                .userId(event.getUserId())
                .serviceName(event.getServiceName())
                .severity(event.getSeverity())
                .summary(aiResponse)
                .rootCause("Pending Parsing")
                .impact("Pending Parsing")
                .recommendation("Pending Parsing")
                .confidence(0)
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(insight);
    }

    public List<Insight> getAllInsights(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Insight getInsightById(String id, String userId) {
        return repository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Insight not found with id: " + id));
    }

    public void deleteInsight(String id, String userId) {
        repository.deleteByIdAndUserId(id, userId);
    }

    public void deleteAllInsights(String userId) {
        repository.deleteByUserId(userId);
    }

    public long getInsightCount(String userId) {
        return repository.countByUserId(userId);
    }
}
