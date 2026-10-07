package com.datastraw.crm.dto.ticketdto;

import com.datastraw.crm.enums.TicketStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class TicketStatusRequest {

	@NotNull(message = "Status is required")
	private TicketStatus status;
}
