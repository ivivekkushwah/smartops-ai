package com.smartops.insightservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "insights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insight {

    @Id
    private String id;

    private String serviceName;

    private String severity;

    private String summary;

    private String rootCause;

    private String impact;

    private String recommendation;

    private Integer confidence;

    private LocalDateTime createdAt;
}