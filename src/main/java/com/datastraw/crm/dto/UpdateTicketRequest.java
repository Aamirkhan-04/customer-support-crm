package com.datastraw.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateTicketRequest {

	@NotBlank
	private String status;
	private String notes;
	
}
