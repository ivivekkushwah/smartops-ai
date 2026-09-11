package com.smartops.auth.dto;


import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class ChangePasswordRequest {

    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 12, max = 128)
    private String newPassword;
}
