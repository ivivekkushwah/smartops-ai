package com.smartops.alert.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AlertStatsResponse {

    private long critical;

    private long warning;

    private long info;

    private long total;

    private long resolved;

    private long active;
}