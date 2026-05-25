package com.smartops.monitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardMetricsResponse {

    private long totalLogs;
    private long activeServices;

    private double cpuMetric;
    private double memoryMetric;

    private double errorRate;
    private double requestThroughput;

    private KafkaMetricsResponse kafkaMetrics;

    private double serviceUptime;
}