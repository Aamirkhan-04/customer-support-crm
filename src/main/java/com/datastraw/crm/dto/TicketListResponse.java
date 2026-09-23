package com.datastraw.crm.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TicketListResponse {

    @JsonProperty("ticket_id")
    private String ticketId;

    @JsonProperty("customer_name")
    private String customerName;

    private String subject;

    private String status;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    public TicketListResponse(
            String ticketId,
            String customerName,
            String subject,
            String status,
            LocalDateTime createdAt) {

        this.ticketId = ticketId;
        this.customerName = customerName;
        this.subject = subject;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getTicketId() {
        return ticketId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getSubject() {
        return subject;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}