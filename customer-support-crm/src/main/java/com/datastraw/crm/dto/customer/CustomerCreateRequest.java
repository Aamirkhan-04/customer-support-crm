package com.datastraw.crm.dto.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class CustomerCreateRequest {

	@NotBlank(message = "Name is required")
	@Size(max = 100, message = "Name must not exceed 100 characters")
	private String name;
	
	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email")
	private String email;
	
	@Size(max = 20, message = "Phone must not exceed 20 characters")
	private String phone;
	
    @Size(max = 255, message = "Address must not exceed 255 characters")
	private String address;
	
}
