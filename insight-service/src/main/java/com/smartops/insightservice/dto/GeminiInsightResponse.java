package com.smartops.insightservice.dto;

import lombok.Data;

@Data
public class GeminiInsightResponse {

    private String severity;

    private String summary;

    private String rootCause;

    private String impact;

    private String recommendation;

    private Integer confidence;
}