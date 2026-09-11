package com.smartops.alert.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.LocalDateTime;

@Document(collection = "alerts")
@CompoundIndexes({
        @CompoundIndex(name = "alerts_user_created", def = "{'userId': 1, 'createdAt': -1}"),
        @CompoundIndex(name = "alerts_user_status_created", def = "{'userId': 1, 'status': 1, 'createdAt': -1}"),
        @CompoundIndex(name = "alerts_user_severity_created", def = "{'userId': 1, 'severity': 1, 'createdAt': -1}")
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Alert {

    @Id
    private String id;

    private String userId;

    private String serviceName;

    private AlertSeverity severity;

    private String title;

    private String message;

    private AlertStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    private LocalDateTime acknowledgedAt;
}
