package com.datastraw.crm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.datastraw.crm.entity.TicketNote;

public interface TicketNoteRepository extends JpaRepository<TicketNote, Long>{

	List<TicketNote> findByTicketIdOrderByCreatedAtAsc(String ticketId);
}
