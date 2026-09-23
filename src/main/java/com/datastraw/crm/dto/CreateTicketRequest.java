package com.datastraw.crm.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateTicketRequest {

	@JsonProperty("customer_name")
	@NotBlank(message = "CustomerName can not be null/Empty or blank")
	private String customerName;
	
	 @JsonProperty("customer_email")
	@NotBlank(message = "Customer email can not be null/Empty or blank")
	@Email(message = "Customer email must be valid")
	private String customerEmail;
	
	@NotBlank(message = "Customer subject can not be null/Empty or blank")
	private String subject;
	
	@NotBlank(message = "description can not be null/Empty or blank")
	private String description;
}
