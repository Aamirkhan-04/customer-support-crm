package com.datastraw.crm.dto.ticketdto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class TicketAssignRequest {

	@NotNull(message =  "Assigned agent ID is required")
	private Long assignedAgentId; 
}
