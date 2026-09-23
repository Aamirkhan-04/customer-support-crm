package com.datastraw.crm.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.datastraw.crm.dto.CreateTicketRequest;
import com.datastraw.crm.dto.TicketDetailResponse;
import com.datastraw.crm.dto.TicketListResponse;
import com.datastraw.crm.dto.UpdateTicketRequest;
import com.datastraw.crm.dto.UpdateTicketResponse;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.entity.TicketNote;
import com.datastraw.crm.entity.TicketStatus;
import com.datastraw.crm.exception.TicketNotFoundException;
import com.datastraw.crm.repository.TicketNoteRepository;
import com.datastraw.crm.repository.TicketRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketNoteRepository ticketNoteRepository;

    public TicketService(
            TicketRepository ticketRepository,
            TicketNoteRepository ticketNoteRepository) {

        this.ticketRepository = ticketRepository;
        this.ticketNoteRepository = ticketNoteRepository;
    }

    @Transactional
    public Ticket createTicket(CreateTicketRequest request) {

        Ticket ticket = new Ticket();

        ticket.setCustomerName(request.getCustomerName());
        ticket.setCustomerEmail(request.getCustomerEmail());
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setTicketId(generateTicketId());

        return ticketRepository.save(ticket);
    }

    private String generateTicketId() {

        long nextId = ticketRepository.count() + 1;

        return String.format("TKT-%03d", nextId);
    }

    public List<TicketListResponse> getAllTickets(
            String status,
            String search) {

        TicketStatus ticketStatus = parseStatus(status);

        String searchValue = (search == null || search.isBlank())
                ? null
                : search.trim();

        return ticketRepository.findTickets(ticketStatus, searchValue)
                .stream()
                .map(ticket -> new TicketListResponse(
                        ticket.getTicketId(),
                        ticket.getCustomerName(),
                        ticket.getSubject(),
                        formatStatus(ticket.getStatus()),
                        ticket.getCreatedAt()
                ))
                .toList();
    }

    private TicketStatus parseStatus(String status) {

        if (status == null || status.isBlank()) {
            return null;
        }

        String normalizedStatus = status.trim()
                .toUpperCase()
                .replace(" ", "_");

        return TicketStatus.valueOf(normalizedStatus);
    }

    private String formatStatus(TicketStatus status) {

        return switch (status) {
            case OPEN -> "Open";
            case IN_PROGRESS -> "In Progress";
            case CLOSED -> "Closed";
        };
    }

    public TicketDetailResponse getTicketById(String ticketId) {

        Ticket ticket = ticketRepository.findByTicketId(ticketId)
                .orElseThrow(() ->
                        new TicketNotFoundException(
                                "Ticket not found: " + ticketId
                        )
                );

        List<String> notes = ticketNoteRepository
                .findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(TicketNote::getNoteText)
                .toList();

        return new TicketDetailResponse(
                ticket.getTicketId(),
                ticket.getCustomerName(),
                ticket.getCustomerEmail(),
                ticket.getSubject(),
                ticket.getDescription(),
                formatStatus(ticket.getStatus()),
                notes
        );
    }
    @Transactional
    public UpdateTicketResponse updateTicket(
            String ticketId,
            UpdateTicketRequest request) {

        Ticket ticket = ticketRepository.findByTicketId(ticketId)
                .orElseThrow(() ->
                        new TicketNotFoundException(
                                "Ticket not found: " + ticketId
                        )
                );

        TicketStatus newStatus = parseStatus(request.getStatus());

        ticket.setStatus(newStatus);

        ticketRepository.saveAndFlush(ticket);

        if (request.getNotes() != null
                && !request.getNotes().isBlank()) {

            TicketNote note = new TicketNote();

            note.setTicketId(ticketId);
            note.setNoteText(request.getNotes());

            ticketNoteRepository.save(note);
        }

        return new UpdateTicketResponse(
                true,
                ticket.getUpdatedAt()
        );
    }
}