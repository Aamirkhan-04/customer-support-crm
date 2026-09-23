package com.datastraw.crm.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TicketDetailResponse {

    @JsonProperty("ticket_id")
    private String ticketId;

    @JsonProperty("customer_name")
    private String customerName;

    @JsonProperty("customer_email")
    private String customerEmail;

    private String subject;

    private String description;

    private String status;

    private List<String> notes;

	public TicketDetailResponse(String ticketId, String customerName, String customerEmail, String subject,
			String description, String status, List<String> notes) {
		this.ticketId = ticketId;
		this.customerName = customerName;
		this.customerEmail = customerEmail;
		this.subject = subject;
		this.description = description;
		this.status = status;
		this.notes = notes;
	}

	public String getTicketId() {
		return ticketId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public String getSubject() {
		return subject;
	}

	public String getDescription() {
		return description;
	}

	public String getStatus() {
		return status;
	}

	public List<String> getNotes() {
		return notes;
	}
	
    
}
