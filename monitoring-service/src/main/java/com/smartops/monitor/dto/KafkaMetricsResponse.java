package com.smartops.monitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KafkaMetricsResponse {

    private int topicsCount;
    private int producerCount;
    private int consumerCount;
    private double throughputMbps;
}