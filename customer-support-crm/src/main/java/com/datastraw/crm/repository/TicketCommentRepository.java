package com.datastraw.crm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.datastraw.crm.entity.TicketComment;

public interface TicketCommentRepository extends JpaRepository<TicketComment, Long>{

	List<TicketComment> findByTicket_IdOrderByCreatedAtAsc(Long ticketId);
	
	Optional<TicketComment> findByIdAndUser_Email(Long id,String email);
}
