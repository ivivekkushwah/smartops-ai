package com.smartops.monitor.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class ServiceStatusRequest {

    @NotBlank
    private String serviceName;

    @NotBlank
    @Pattern(regexp = "https?://.+", message = "Base URL must use HTTP or HTTPS")
    private String baseUrl;

    public ServiceStatusRequest() {
    }

    public ServiceStatusRequest(String serviceName, String baseUrl) {
        this.serviceName = serviceName;
        this.baseUrl = baseUrl;
    }


}
