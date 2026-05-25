package com.smartops.monitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PerformanceMetricResponse {

    private LocalDateTime timestamp;
    private double value;
    private String label;


}