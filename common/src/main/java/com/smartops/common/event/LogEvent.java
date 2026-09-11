package com.smartops.common.event;

import java.time.LocalDateTime;

public class LogEvent {

    private String serviceName;

    /** Owner of a user-managed monitored service, when applicable. */
    private String userId;

    private String level;

    private String message;

    private LocalDateTime timestamp;

    public LogEvent() {}

    public LogEvent(String serviceName, String userId, String level, String message, LocalDateTime timestamp) {
        this.serviceName = serviceName;
        this.userId = userId;
        this.level = level;
        this.message = message;
        this.timestamp = timestamp;
    }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
