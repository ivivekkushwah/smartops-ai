package com.smartops.auth.kafka;

import com.smartops.common.event.LogEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private static final String TOPIC = "smartops-logs";

    private final KafkaTemplate<String, LogEvent> kafkaTemplate;

    public void sendLog(LogEvent logEvent) {

        kafkaTemplate.send(TOPIC, logEvent);
    }
}