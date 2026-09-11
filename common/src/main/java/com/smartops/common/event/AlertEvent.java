package com.smartops.common.event;

import java.time.LocalDateTime;

public class AlertEvent {

    private String userId;

    private String serviceName;

    private String severity;

    private String message;

    private String status;

    private LocalDateTime timestamp;

    private String title;

    public AlertEvent() {}

    public AlertEvent(String userId, String serviceName, String severity, String message,
                      String status, LocalDateTime timestamp, String title) {
        this.userId = userId;
        this.serviceName = serviceName;
        this.severity = severity;
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
        this.title = title;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
