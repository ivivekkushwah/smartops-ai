package com.smartops.alert.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "alerts")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Alert {

    @Id
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