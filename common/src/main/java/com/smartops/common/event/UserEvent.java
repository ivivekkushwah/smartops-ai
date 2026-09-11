package com.smartops.common.event;

public class UserEvent {

    private String eventType;
    private String userId;

    public UserEvent() {}

    public UserEvent(String eventType, String userId) {
        this.eventType = eventType;
        this.userId = userId;
    }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
