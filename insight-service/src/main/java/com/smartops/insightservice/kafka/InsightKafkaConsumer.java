package com.smartops.insightservice.kafka;


import com.smartops.insightservice.dto.AlertEvent;
import com.smartops.insightservice.model.Insight;
import com.smartops.insightservice.service.InsightService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
@Slf4j
@RequiredArgsConstructor
public class InsightKafkaConsumer {

    private final InsightService insightService;

    @KafkaListener(
            topics = "smartops-alerts",
            groupId = "insight-group"
    )
    public void consume(AlertEvent event) {

        System.out.println("================================");
        System.out.println("SERVICE  : " + event.getServiceName());
        System.out.println("SEVERITY : " + event.getSeverity());
        System.out.println("TITLE    : " + event.getTitle());
        System.out.println("MESSAGE  : " + event.getMessage());
        System.out.println("================================");

        if (!"CRITICAL".equalsIgnoreCase(event.getSeverity())) {
            return;
        }

        Insight savedInsight =
                insightService.saveInsight(event);

        log.info(
                "Insight saved successfully : {}",
                savedInsight.getId()
        );
    }
}