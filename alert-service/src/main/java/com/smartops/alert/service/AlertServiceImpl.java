package com.smartops.alert.service;

import com.smartops.alert.dto.AlertResponse;
import com.smartops.alert.dto.AlertStatsResponse;
import com.smartops.alert.dto.CreateAlertRequest;
import com.smartops.alert.kafka.KafkaProducerService;
import com.smartops.alert.model.Alert;
import com.smartops.alert.model.AlertSeverity;
import com.smartops.alert.model.AlertStatus;
import com.smartops.alert.repository.AlertRepository;
import com.smartops.common.event.AlertEvent;
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
                .userId(request.getUserId())
                .serviceName(request.getServiceName())
                .severity(request.getSeverity())
                .title(request.getTitle())
                .message(request.getMessage())
                .status(AlertStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        Alert savedAlert = alertRepository.save(alert);


        // ==========================================
        // CREATE KAFKA EVENT
        // ==========================================

        AlertEvent event = new AlertEvent();

        event.setUserId(savedAlert.getUserId());
        event.setServiceName(savedAlert.getServiceName());
        event.setSeverity(savedAlert.getSeverity().name());
        event.setMessage(savedAlert.getMessage());
        event.setStatus(savedAlert.getStatus().name());
        event.setTimestamp(savedAlert.getCreatedAt());
        event.setTitle(savedAlert.getTitle());


        // ==========================================
        // REALTIME PUSH
        // ==========================================

        messagingTemplate.convertAndSend(
                "/topic/alerts/" + savedAlert.getUserId(),
                mapToResponse(savedAlert)
        );


        producer.sendAlert(event);

        return mapToResponse(savedAlert);
    }


    // ==========================================
    // GET ALL ALERTS FOR USER
    // ==========================================

    @Override
    public List<AlertResponse> getAllAlerts(String userId) {

        return alertRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // GET ACTIVE ALERTS FOR USER
    // ==========================================

    @Override
    public List<AlertResponse> getActiveAlerts(String userId) {

        return alertRepository
                .findByUserIdAndStatus(
                        userId,
                        AlertStatus.ACTIVE
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // GET ALERT BY ID
    // ==========================================

    @Override
    public AlertResponse getAlertById(
            String id,
            String userId
    ) {

        Alert alert = alertRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        return mapToResponse(alert);
    }


    // ==========================================
    // RESOLVE ALERT
    // ==========================================

    @Override
    public AlertResponse resolveAlert(
            String id,
            String userId
    ) {

        Alert alert = alertRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        alert.setStatus(AlertStatus.RESOLVED);

        alert.setResolvedAt(
                LocalDateTime.now()
        );

        Alert updatedAlert =
                alertRepository.save(alert);


        messagingTemplate.convertAndSend(
                "/topic/alerts/" + userId,
                mapToResponse(updatedAlert)
        );

        return mapToResponse(updatedAlert);
    }


    // ==========================================
    // ACKNOWLEDGE ALERT
    // ==========================================

    @Override
    public AlertResponse acknowledgeAlert(
            String id,
            String userId
    ) {

        Alert alert = alertRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        alert.setStatus(AlertStatus.ACKNOWLEDGED);

        alert.setAcknowledgedAt(
                LocalDateTime.now()
        );

        Alert updatedAlert =
                alertRepository.save(alert);


        messagingTemplate.convertAndSend(
                "/topic/alerts/" + userId,
                mapToResponse(updatedAlert)
        );

        return mapToResponse(updatedAlert);
    }


    // ==========================================
    // GET CRITICAL ALERTS FOR USER
    // ==========================================

    @Override
    public List<AlertResponse> getCriticalAlerts(
            String userId
    ) {

        return alertRepository
                .findByUserIdAndSeverity(
                        userId,
                        AlertSeverity.CRITICAL
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // ALERT STATS FOR USER
    // ==========================================

    @Override
    public AlertStatsResponse getAlertStats(
            String userId
    ) {

        long total =
                alertRepository.countByUserId(userId);

        long critical =
                alertRepository.countByUserIdAndSeverity(
                        userId,
                        AlertSeverity.CRITICAL
                );

        long warning =
                alertRepository.countByUserIdAndSeverity(
                        userId,
                        AlertSeverity.WARNING
                );

        long info =
                alertRepository.countByUserIdAndSeverity(
                        userId,
                        AlertSeverity.INFO
                );

        long resolved =
                alertRepository.countByUserIdAndStatus(
                        userId,
                        AlertStatus.RESOLVED
                );

        long active =
                alertRepository.countByUserIdAndStatus(
                        userId,
                        AlertStatus.ACTIVE
                );

        long acknowledged =
                alertRepository.countByUserIdAndStatus(
                        userId,
                        AlertStatus.ACKNOWLEDGED
                );

        return AlertStatsResponse.builder()
                .total(total)
                .critical(critical)
                .warning(warning)
                .info(info)
                .resolved(resolved)
                .active(active)
                .acknowledged(acknowledged)
                .build();
    }


    // ==========================================
    // DELETE ALERT
    // ==========================================

    @Override
    public void deleteAlert(
            String id,
            String userId
    ) {

        Alert alert = alertRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        alertRepository.delete(alert);


        messagingTemplate.convertAndSend(
                "/topic/alerts/delete/" + userId,
                Map.of("id", id)
        );
    }


    // ==========================================
    // DELETE ALL ALERTS FOR USER
    // ==========================================

    @Override
    public void deleteAlertsByUserId(String userId) {

        alertRepository.deleteByUserId(userId);
    }


    // ==========================================
    // MAPPER
    // ==========================================

    private AlertResponse mapToResponse(Alert alert) {

        return AlertResponse.builder()
                .id(alert.getId())
                .userId(alert.getUserId())
                .serviceName(alert.getServiceName())
                .severity(alert.getSeverity())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .status(alert.getStatus())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .acknowledgedAt(alert.getAcknowledgedAt())
                .build();
    }
}
