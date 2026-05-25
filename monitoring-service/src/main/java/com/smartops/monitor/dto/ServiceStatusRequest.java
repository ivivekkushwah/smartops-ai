package com.smartops.monitor.dto;

import lombok.Data;
import lombok.Getter;

@Data
public class ServiceStatusRequest {

    private String userId;
    private String serviceName;
    private String baseUrl;

    public ServiceStatusRequest() {
    }

    public ServiceStatusRequest(String userId, String serviceName, String baseUrl) {
        this.userId = userId;
        this.serviceName = serviceName;
        this.baseUrl = baseUrl;
    }


}