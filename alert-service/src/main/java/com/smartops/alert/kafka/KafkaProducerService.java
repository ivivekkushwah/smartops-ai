package com.smartops.alert.kafka;

import com.smartops.common.event.AlertEvent;
import com.smartops.common.event.LogEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private static final String ALERT_TOPIC = "alerts-topic";


    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendAlert(AlertEvent event) {
        kafkaTemplate.send(ALERT_TOPIC, event);
        System.out.println("🚨 ALERT SENT: " + event.getMessage());
    }
}