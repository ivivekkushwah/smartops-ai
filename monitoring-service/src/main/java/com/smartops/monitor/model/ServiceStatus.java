package com.smartops.monitor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.LocalDateTime;

@Document(collection = "service_status")
@CompoundIndexes({
        @CompoundIndex(name = "services_user_name", def = "{'userId': 1, 'serviceName': 1}"),
        @CompoundIndex(name = "services_user_status", def = "{'userId': 1, 'status': 1}")
})
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
