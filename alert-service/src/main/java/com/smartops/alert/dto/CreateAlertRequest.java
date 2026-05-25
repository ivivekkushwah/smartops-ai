package com.smartops.alert.dto;

import com.smartops.alert.model.AlertSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Data
public class CreateAlertRequest {

    @NotBlank
    private String serviceName;

    @NotNull
    private AlertSeverity severity;

    @NotBlank
    private String title;

    @NotBlank
    private String message;
}