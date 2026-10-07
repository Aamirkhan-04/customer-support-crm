package com.datastraw.crm.dto.userdto;

import com.datastraw.crm.enums.RoleName;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private RoleName role;
    private Boolean enabled;
}