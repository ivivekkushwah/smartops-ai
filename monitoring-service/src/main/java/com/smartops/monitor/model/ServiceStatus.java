package com.smartops.monitor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "service_status")
@TypeAlias("ServiceStatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceStatus {

    @Id
    private String id;
    private String userId;
    private String serviceName;

    private String status;
    private String baseUrl;

    private Long responseTime;

    private LocalDateTime lastChecked;
}