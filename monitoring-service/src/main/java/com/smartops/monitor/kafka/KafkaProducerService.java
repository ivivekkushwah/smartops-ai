package com.smartops.monitor.kafka;

import com.smartops.common.event.AlertEvent;
import com.smartops.common.event.LogEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private static final String LOG_TOPIC =
            "smartops-logs";

    private static final String ALERT_TOPIC =
            "alerts-topic";

    // ONE GENERIC TEMPLATE
    private final KafkaTemplate<String, Object>
            kafkaTemplate;

    // ================= SEND LOG =================

    public void sendLog(
            String service,
            String level,
            String message
    ) {

        LogEvent event = new LogEvent();

        event.setServiceName(service);
        event.setLevel(level);
        event.setMessage(message);
        event.setTimestamp(LocalDateTime.now());

        kafkaTemplate.send(
                LOG_TOPIC,
                event
        );

        System.out.println(
                "📨 Log sent: " + message
        );
    }

    // ================= SEND ALERT =================

    public void sendAlert(
            AlertEvent event
    ) {

        kafkaTemplate.send(
                ALERT_TOPIC,
                event
        );

        System.out.println(
                "🚨 ALERT SENT: "
                        + event.getMessage()
        );
    }
}