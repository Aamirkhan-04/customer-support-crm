package com.datastraw.crm.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateTicketResponse {

	@JsonProperty("ticket_id")
	private String ticketId;
	
	@JsonProperty("created_at")
	private LocalDateTime createdAt;
}
