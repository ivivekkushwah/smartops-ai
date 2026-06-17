package com.smartops.insightservice.service;

import com.smartops.insightservice.dto.AlertEvent;
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
                """
                .formatted(
                        event.getServiceName(),
                        event.getSeverity(),
                        event.getTitle(),
                        event.getMessage()
                );

        String aiResponse = geminiService.generateInsight(prompt);

        log.info("======================================");
        log.info("GEMINI RESPONSE:");
        log.info(aiResponse);
        log.info("======================================");

        Insight insight = Insight.builder()
                .serviceName(event.getServiceName())
                .severity(event.getSeverity())

                // Temporary until parsing is added
                .summary(aiResponse)

                .rootCause("Pending Parsing")
                .impact("Pending Parsing")
                .recommendation("Pending Parsing")
                .confidence(0)

                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(insight);
    }

    public List<Insight> getAllInsights() {
        return repository.findAll();
    }

    public Insight getInsightById(String id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Insight not found with id: " + id));
    }

    public void deleteInsight(String id) {
        repository.deleteById(id);
    }

    public void deleteAllInsights() {
        repository.deleteAll();
    }

    public long getInsightCount() {
        return repository.count();
    }
}