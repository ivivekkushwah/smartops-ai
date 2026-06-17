package com.smartops.insightservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertEvent {

    private String serviceName;

    private String severity;

    private String title;

    private String message;
}