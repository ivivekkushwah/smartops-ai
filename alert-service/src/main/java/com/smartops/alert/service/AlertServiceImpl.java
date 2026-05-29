package com.smartops.alert.service;



import com.smartops.alert.dto.AlertResponse;
import com.smartops.alert.dto.AlertStatsResponse;
import com.smartops.alert.dto.CreateAlertRequest;
import com.smartops.alert.kafka.KafkaProducerService;
import com.smartops.alert.model.Alert;
import com.smartops.alert.model.AlertSeverity;
import com.smartops.alert.model.AlertStatus;
import com.smartops.alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;

    private final SimpMessagingTemplate messagingTemplate;
    private final KafkaProducerService producer;

    // ==========================================
    // CREATE ALERT
    // ==========================================

    @Override
    public AlertResponse createAlert(CreateAlertRequest request) {

        Alert alert = Alert.builder()
                .serviceName(request.getServiceName())
                .severity(request.getSeverity())
                .title(request.getTitle())
                .message(request.getMessage())
                .status(AlertStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        Alert savedAlert = alertRepository.save(alert);

        // REALTIME PUSH
        messagingTemplate.convertAndSend(
                "/topic/alerts",
                mapToResponse(savedAlert)
        );

        producer.sendLog(
                "ALERT",
                "WARN",
                "New alert created for service: " + request.getServiceName()
        );

        return mapToResponse(savedAlert);
    }

    // ==========================================
    // GET ALL ALERTS
    // ==========================================

    @Override
    public List<AlertResponse> getAllAlerts() {

        return alertRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================================
    // GET ACTIVE ALERTS
    // ==========================================

    @Override
    public List<AlertResponse> getActiveAlerts() {

        return alertRepository.findByStatus(AlertStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================================
    // GET ALERT BY ID
    // ==========================================

    @Override
    public AlertResponse getAlertById(String id) {

        Alert alert = alertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        return mapToResponse(alert);
    }

    // ==========================================
    // RESOLVE ALERT
    // ==========================================

    @Override
    public AlertResponse resolveAlert(String id) {

        Alert alert = alertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());

        Alert updatedAlert = alertRepository.save(alert);

        messagingTemplate.convertAndSend(
                "/topic/alerts",
                mapToResponse(updatedAlert)
        );
        producer.sendLog(
                "ALERT",
                "INFO",
                "Alert resolved for service: " + alert.getServiceName()
        );

        return mapToResponse(updatedAlert);
    }

    // ==========================================
    // ACKNOWLEDGE ALERT
    // ==========================================

    @Override
    public AlertResponse acknowledgeAlert(String id) {

        Alert alert = alertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        alert.setStatus(AlertStatus.ACKNOWLEDGED);
        alert.setAcknowledgedAt(LocalDateTime.now());

        Alert updatedAlert = alertRepository.save(alert);

        messagingTemplate.convertAndSend(
                "/topic/alerts",
                mapToResponse(updatedAlert)
        );

        producer.sendLog(
                "ALERT",
                "INFO",
                "Alert acknowledged for service: " + alert.getServiceName()
        );

        return mapToResponse(updatedAlert);
    }

    // ==========================================
    // GET CRITICAL ALERTS
    // ==========================================

    @Override
    public List<AlertResponse> getCriticalAlerts() {

        return alertRepository
                .findBySeverity(AlertSeverity.CRITICAL)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ==========================================
    // ALERT STATS (NO HARDCODE)
    // ==========================================

    @Override
    public AlertStatsResponse getAlertStats() {

        long total = alertRepository.count();

        long critical = alertRepository.countBySeverity(AlertSeverity.CRITICAL);

        long warning = alertRepository.countBySeverity(AlertSeverity.WARNING);

        long info = alertRepository.countBySeverity(AlertSeverity.INFO);

        long resolved = alertRepository.countByStatus(AlertStatus.RESOLVED);

        long active = alertRepository.countByStatus(AlertStatus.ACTIVE);

        return AlertStatsResponse.builder()
                .total(total)
                .critical(critical)
                .warning(warning)
                .info(info)
                .resolved(resolved)
                .active(active)
                .build();
    }

    // ==========================================
    // DELETE ALERT
    // ==========================================

    @Override
    public void deleteAlert(String id) {
        producer.sendLog(
                "ALERT",
                "WARN",
                "Alert deleted with ID: " + id
        );

        alertRepository.deleteById(id);

        // Send structured delete event (better than raw id)
        messagingTemplate.convertAndSend(
                "/topic/alerts/delete",
                Map.of("id", id)
        );

    }

    // ==========================================
    // MAPPER
    // ==========================================

    private AlertResponse mapToResponse(Alert alert) {

        return AlertResponse.builder()
                .id(alert.getId())
                .serviceName(alert.getServiceName())
                .severity(alert.getSeverity())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .status(alert.getStatus())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .acknowledgedAt(alert.getAcknowledgedAt()) // FIXED
                .build();
    }
}