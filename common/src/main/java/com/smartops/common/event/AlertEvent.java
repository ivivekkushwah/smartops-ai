package com.smartops.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlertEvent {

    private String serviceName;
    private String severity; // CRITICAL, WARNING
    private String message;
    private LocalDateTime timestamp;
    private String status;


    public AlertEvent(String serviceName, String severity, String message, String status, LocalDateTime timestamp) {
        this.serviceName = serviceName;
        this.severity = severity;
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    }
}