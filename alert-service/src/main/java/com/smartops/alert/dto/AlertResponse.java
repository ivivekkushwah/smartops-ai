package com.smartops.alert.dto;



import com.smartops.alert.model.AlertSeverity;
import com.smartops.alert.model.AlertStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AlertResponse {

    private String id;

    private String serviceName;

    private AlertSeverity severity;

    private String title;

    private String message;

    private AlertStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    private LocalDateTime acknowledgedAt;
}