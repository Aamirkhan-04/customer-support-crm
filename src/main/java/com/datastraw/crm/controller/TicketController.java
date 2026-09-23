package com.datastraw.crm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.datastraw.crm.dto.CreateTicketRequest;
import com.datastraw.crm.dto.CreateTicketResponse;
import com.datastraw.crm.dto.TicketDetailResponse;
import com.datastraw.crm.dto.TicketListResponse;
import com.datastraw.crm.dto.UpdateTicketRequest;
import com.datastraw.crm.dto.UpdateTicketResponse;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.service.TicketService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<CreateTicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request) {

        Ticket ticket = ticketService.createTicket(request);

        CreateTicketResponse response =
                new CreateTicketResponse(
                        ticket.getTicketId(),
                        ticket.getCreatedAt()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<TicketListResponse>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(
                ticketService.getAllTickets(status, search)
        );
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketDetailResponse> getTicketById(
            @PathVariable String ticketId) {

        return ResponseEntity.ok(
                ticketService.getTicketById(ticketId)
        );
    }

    @PutMapping("/{ticketId}")
    public ResponseEntity<UpdateTicketResponse> updateTicket(
            @PathVariable String ticketId,
            @Valid @RequestBody UpdateTicketRequest request) {

        return ResponseEntity.ok(
                ticketService.updateTicket(ticketId, request)
        );
    }
}