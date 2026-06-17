package com.smartops.auth.dto;

import lombok.Data;

@Data
public class ProfileRequest {

    private String name;

    private String email;
}