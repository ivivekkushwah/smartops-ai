package com.smartops.monitor.kafka;

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



    // ONE GENERIC TEMPLATE
    private final KafkaTemplate<String, Object>
            kafkaTemplate;

    // ================= SEND LOG =================

    public void sendLog(
            String service,
            String level,
            String message
    ) {
        sendLog(service, level, message, null);
    }

    public void sendLog(
            String service,
            String level,
            String message,
            String userId
    ) {

        LogEvent event = new LogEvent();

        event.setServiceName(service);
        event.setUserId(userId);
        event.setLevel(level);
        event.setMessage(message);
        event.setTimestamp(LocalDateTime.now());

        kafkaTemplate.send(
                LOG_TOPIC,
                event
        );

    }


}
