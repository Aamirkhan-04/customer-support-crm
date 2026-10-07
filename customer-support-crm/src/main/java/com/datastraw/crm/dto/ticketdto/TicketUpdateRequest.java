package com.datastraw.crm.dto.ticketdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class TicketUpdateRequest {

	@NotBlank(message = "Subject is required")
	@Size(max = 150, message = "Subject must not exceed 150 characters")
	private String  subject;
	
	@NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
	private String description; 
	
}
