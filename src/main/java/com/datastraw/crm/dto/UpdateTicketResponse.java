package com.datastraw.crm.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class UpdateTicketResponse {

	private boolean success;
	@JsonProperty("updated_at")
	 private LocalDateTime updatedAt;
	

}
