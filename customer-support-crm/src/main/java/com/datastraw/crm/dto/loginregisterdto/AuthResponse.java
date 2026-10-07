package com.datastraw.crm.dto.loginregisterdto;

import com.datastraw.crm.enums.RoleName; 

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse{

	private String token;
	private String email;
	private RoleName  role;
}
