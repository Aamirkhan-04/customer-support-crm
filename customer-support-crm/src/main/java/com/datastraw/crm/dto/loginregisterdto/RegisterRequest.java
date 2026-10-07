package com.datastraw.crm.dto.loginregisterdto;

import jakarta.validation.constraints.Email; 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class RegisterRequest {

	@NotBlank(message = "Username is required")
	private String username;
	
	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email")
	private String email;
	
	@NotBlank(message = "Password is required")
	@Size(min = 6,message = "Password must be at least 6 characters")
	private String password;
}
