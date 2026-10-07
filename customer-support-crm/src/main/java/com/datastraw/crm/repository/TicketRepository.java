package com.datastraw.crm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.enums.TicketPriority;
import com.datastraw.crm.enums.TicketStatus;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByTicketId(String ticketId);

    boolean existsByTicketId(String ticketId);

    
    List<Ticket> findByCustomer_User_Id(Long userId);

    List<Ticket> findByAssignedAgent_Id(Long agentId);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByPriority(TicketPriority priority);
    
    List<Ticket> findByAssignedAgent_Manager_Id(Long managerId);

}