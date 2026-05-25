package com.smartops.monitor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "logs")
public class LogDocument {

    @Id
    private String id;

    private String serviceName;

    private String level;

    private String message;

    private LocalDateTime timestamp;
}