package com.smartops.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserSettingsRequest {

    @Min(5)
    @Max(60)
    private Integer dashboardRefreshRate;
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    @Pattern(regexp = "dark|light|system")
    private String theme;
}
