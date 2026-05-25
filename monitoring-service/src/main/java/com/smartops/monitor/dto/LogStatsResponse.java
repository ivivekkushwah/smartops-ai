package com.smartops.monitor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LogStatsResponse {

    private long totalLogs;

    private long logsPerMinute;

    private long errorCount;

    private long warningCount;

    private long infoCount;
}