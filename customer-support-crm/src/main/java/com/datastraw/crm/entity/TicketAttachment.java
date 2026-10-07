package com.datastraw.crm.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ticket_attachments")
@Getter
@Setter
@NoArgsConstructor
public class TicketAttachment {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ticket_id", nullable = false)
	private Ticket ticket;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uploaded_by", nullable = false)
	private User uploadedBy;
	
	@Column(nullable = false, length = 255)
	private String fileName;
	
	@Column(nullable = false, length = 500)
	private String fileUrl;
	
	@Column(nullable = false, length = 100)
	private String contentType;
	
	@Column(nullable = false)
	private Long fileSize;
	
	@Column(nullable = false)
	private LocalDateTime createdAt;
	
	@PrePersist
	protected void onCreate() {
		createdAt=LocalDateTime.now();
	}
	
}
