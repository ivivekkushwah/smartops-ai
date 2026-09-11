package com.smartops.alert.dto;

import com.smartops.alert.model.AlertSeverity;
import com.smartops.alert.model.AlertStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class CreateAlertRequest {

    @NotBlank
    private String serviceName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String userId;

    @NotNull
    private AlertSeverity severity;

    @NotBlank
    private String title;

    @NotBlank
    private String message;

    private AlertStatus status;
}
