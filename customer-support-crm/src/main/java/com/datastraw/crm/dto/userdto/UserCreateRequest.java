package com.datastraw.crm.dto.userdto;

import com.datastraw.crm.enums.RoleName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class UserCreateRequest {

	@NotBlank(message = "Username is required")
	@Size(max = 50,message = "Username must not exceed 50 characters")
	private String username;
	
	@NotBlank(message = "Email is required")
	@Email(message =  "Enter a valid email")
	private String email;
	
	@NotBlank(message = "Password is required")
	@Size(min = 6,max = 100,
	              message =  "Password must be between 6 and 100 characters")
	private String password;
	
	@NotNull(message = "Role is required")
	private RoleName role;
	
	
}
