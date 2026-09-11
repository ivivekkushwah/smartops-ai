package com.smartops.monitor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "logs")
@CompoundIndexes({
        @CompoundIndex(name = "logs_user_timestamp", def = "{'userId': 1, 'timestamp': -1}"),
        @CompoundIndex(name = "logs_user_service_timestamp", def = "{'userId': 1, 'serviceName': 1, 'timestamp': -1}"),
        @CompoundIndex(name = "logs_user_level_timestamp", def = "{'userId': 1, 'level': 1, 'timestamp': -1}")
})
public class LogDocument {

    @Id
    private String id;

    private String userId;

    private String serviceName;

    private String level;

    private String message;

    private LocalDateTime timestamp;
}
