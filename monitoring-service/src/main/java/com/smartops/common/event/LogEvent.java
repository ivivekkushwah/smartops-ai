package com.smartops.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogEvent {

    private String serviceName;

    private String level;

    private String message;

    private LocalDateTime timestamp;
}