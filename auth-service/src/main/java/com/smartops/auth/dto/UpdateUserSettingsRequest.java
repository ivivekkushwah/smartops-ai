package com.smartops.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserSettingsRequest {

    private Integer dashboardRefreshRate;
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private String theme;
}