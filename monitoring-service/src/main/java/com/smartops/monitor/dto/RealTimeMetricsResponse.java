package com.smartops.monitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RealTimeMetricsResponse {

    private double cpuUsage;
    private double memoryUsage;
    private double requestRate;
    private double errorRate;

    private int activeConnections;
}