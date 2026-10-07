package com.datastraw.crm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.datastraw.crm.entity.TicketAttachment;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long>{

	List<TicketAttachment> findByTicketId(Long ticketId);
}
