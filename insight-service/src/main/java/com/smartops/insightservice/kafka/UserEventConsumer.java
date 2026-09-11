package com.smartops.insightservice.kafka;

import com.smartops.common.event.UserEvent;
import com.smartops.insightservice.repository.InsightRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventConsumer {

    private final InsightRepository insightRepository;

    @KafkaListener(topics = "user-events", groupId = "insight-user-group")
    public void consume(UserEvent event) {
        if ("USER_DELETED".equals(event.getEventType())) {
            insightRepository.deleteByUserId(event.getUserId());
            log.info("Insights removed for deleted user: {}", event.getUserId());
        }
    }
}
