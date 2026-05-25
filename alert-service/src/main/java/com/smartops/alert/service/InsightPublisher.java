package com.smartops.alert.service;

import com.smartops.alert.model.Insight;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsightPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishInsight(Insight insight) {
        messagingTemplate.convertAndSend("/topic/insights", insight);
    }
}