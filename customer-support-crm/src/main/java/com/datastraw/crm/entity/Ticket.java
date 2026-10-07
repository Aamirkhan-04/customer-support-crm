package com.datastraw.crm.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.datastraw.crm.enums.TicketPriority;
import com.datastraw.crm.enums.TicketStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ticketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;
   
    @Column(nullable = false,length = 150)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT",length = 200)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 30)
    private TicketStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 30)
    private TicketPriority priority;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        
    	if (ticketId==null) {
			ticketId="TKT-"+UUID.randomUUID()
			         .toString()
			         .substring(0,8)
			         .toUpperCase();
		}

        if (status == null) {
            status = TicketStatus.OPEN;
        }
        if (priority==null) {
			priority=TicketPriority.MEDIUM;
		}
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}