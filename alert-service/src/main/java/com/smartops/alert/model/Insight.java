package com.smartops.alert.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Insight {

    private String id;
    private String type;       // ANOMALY, PERFORMANCE, ERROR
    private String message;
    private String severity;   // CRITICAL, WARNING, INFO
    private LocalDateTime timestamp;
}