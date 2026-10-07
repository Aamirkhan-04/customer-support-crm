package com.datastraw.crm.dto.ticketdto;

import com.datastraw.crm.enums.TicketPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TicketCreateRequest {

    @NotBlank(message = "Subject is required")
    @Size(max = 150, message = "Subject must not exceed 150 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;
    
    private Long customerId;
}