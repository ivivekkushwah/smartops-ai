package com.smartops.alert.service;

import com.smartops.alert.model.Alert;
import com.smartops.alert.model.Insight;
import com.smartops.alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
@Service
@RequiredArgsConstructor
public class InsightService {

    private final AlertRepository alertRepository;
    private final InsightPublisher publisher;

    public List<Insight> getInsights() {

        List<Alert> alerts = alertRepository.findAll();

        return alerts.stream()
                .sorted(
                        Comparator.comparing(Alert::getCreatedAt)
                                .reversed()
                )
                .limit(20)
                .map(alert ->
                        Insight.builder()
                                .id(alert.getId())
                                .type(alert.getStatus().name())
                                .severity(alert.getSeverity().name())
                                .message(
                                        "[" + alert.getServiceName() + "] "
                                                + alert.getTitle()
                                )
                                .timestamp(alert.getCreatedAt())
                                .build()
                )
                .toList();
    }

    public Insight generateInsight(
            String message,
            String severity
    ) {

        Insight insight = Insight.builder()
                .id(UUID.randomUUID().toString())
                .type("ANOMALY")
                .message(message)
                .severity(severity)
                .timestamp(LocalDateTime.now())
                .build();

        publisher.publishInsight(insight);

        return insight;
    }
}