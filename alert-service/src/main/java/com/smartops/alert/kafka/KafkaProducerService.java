package com.smartops.alert.kafka;

import com.smartops.common.event.LogEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private static final String TOPIC = "smartops-logs";

    private final KafkaTemplate<String, LogEvent> kafkaTemplate;

    public void sendLog(String service, String level, String message) {

        LogEvent event = new LogEvent();
        event.setServiceName(service);
        event.setLevel(level);
        event.setMessage(message);
        event.setTimestamp(LocalDateTime.now());

        kafkaTemplate.send(TOPIC, event);
    }
}