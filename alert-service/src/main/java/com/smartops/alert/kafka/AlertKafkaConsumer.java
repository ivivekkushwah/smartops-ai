package com.smartops.alert.kafka;

import com.smartops.alert.dto.CreateAlertRequest;
import com.smartops.alert.model.AlertSeverity;
import com.smartops.alert.model.AlertStatus;
import com.smartops.alert.service.AlertService;
import com.smartops.common.event.AlertEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
public class AlertKafkaConsumer {

    private final AlertService alertService;

    @KafkaListener(
            topics = "alerts-topic",
            groupId = "alert-group"
    )
    public void consume(AlertEvent event) {

        System.out.println("🔥 ALERT RECEIVED: " + event);

        CreateAlertRequest request = new CreateAlertRequest();

        request.setServiceName(event.getServiceName());
        request.setSeverity(AlertSeverity.valueOf(event.getSeverity())); // 🔥 dynamic
        request.setTitle("Service Alert");
        request.setMessage(event.getMessage());

        // 🔥 HANDLE STATUS
        if ("ACTIVE".equalsIgnoreCase(event.getStatus())) {
            request.setStatus(AlertStatus.valueOf("ACTIVE"));
        } else if ("RESOLVED".equalsIgnoreCase(event.getStatus())) {
            request.setStatus(AlertStatus.valueOf("RESOLVED"));
        }

        alertService.createAlert(request);
    }
}