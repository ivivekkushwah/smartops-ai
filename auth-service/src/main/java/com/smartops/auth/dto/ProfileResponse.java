package com.smartops.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {

    private Long id;

    private String name;

    private String email;

    private String role;
}