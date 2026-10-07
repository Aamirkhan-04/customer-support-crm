package com.datastraw.crm.dto.loginregisterdto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class LoginRequest {

	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email")
	private String email;
	
	@NotBlank(message = "Password is required")
	private String password;
}
