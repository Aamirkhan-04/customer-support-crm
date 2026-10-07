package com.datastraw.crm.dto.ticketdto;

import java.time.LocalDateTime;
import java.util.List;

import com.datastraw.crm.dto.attachment.dto.AttachmentResponse;
import com.datastraw.crm.dto.comment.CommentResponse;
import com.datastraw.crm.dto.customer.CustomerResponse;
import com.datastraw.crm.enums.TicketPriority;
import com.datastraw.crm.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TicketDetailResponse {

	private Long id;
    private String ticketId;
    private String subject;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private CustomerResponse customer;
    private String assignedAgentName;
    private List<CommentResponse> comments;
    private List<AttachmentResponse> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}
