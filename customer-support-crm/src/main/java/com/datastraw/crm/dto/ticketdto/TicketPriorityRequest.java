package com.datastraw.crm.dto.ticketdto;

import com.datastraw.crm.enums.TicketPriority;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class TicketPriorityRequest {

	@NotNull(message = "Priority is required")
	private TicketPriority priority;
}
