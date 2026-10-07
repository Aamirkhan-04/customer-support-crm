package com.datastraw.crm.dto.ticketdto;

import java.time.LocalDateTime;

import com.datastraw.crm.enums.TicketPriority;
import com.datastraw.crm.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketResponse {

	    private Long id;
	    private String ticketId;
	    private String subject;
	    private String description;
	    private TicketStatus status;
	    private TicketPriority priority;
	    private String customerName;
	    private String assignedAgentName;
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
}