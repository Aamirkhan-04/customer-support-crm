package com.datastraw.crm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.datastraw.crm.dto.ticketdto.TicketAssignRequest;
import com.datastraw.crm.dto.ticketdto.TicketCreateRequest;
import com.datastraw.crm.dto.ticketdto.TicketPriorityRequest;
import com.datastraw.crm.dto.ticketdto.TicketResponse;
import com.datastraw.crm.dto.ticketdto.TicketStatusRequest;
import com.datastraw.crm.dto.ticketdto.TicketUpdateRequest;
import com.datastraw.crm.dto.userdto.UserResponse;
import com.datastraw.crm.enums.TicketPriority;
import com.datastraw.crm.enums.TicketStatus;
import com.datastraw.crm.service.TicketService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearer-key")
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody TicketCreateRequest request,
            Authentication authentication) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ticketService.createTicket(
                        authentication.getName(),
                        getRole(authentication),
                        request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getAllTickets(
                        authentication.getName(),
                        getRole(authentication),
                        search,
                        status,
                        priority));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/team-agents")
    public ResponseEntity<List<UserResponse>> getManagerTeamAgents(
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getManagerTeamAgents(
                        authentication.getName()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable String ticketId,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.getTicketById(
                        ticketId,
                        authentication.getName(),
                        getRole(authentication)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT')")
    @PutMapping("/{ticketId}")
    public ResponseEntity<TicketResponse> updateTicket(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketUpdateRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.updateTicket(
                        ticketId,
                        authentication.getName(),
                        getRole(authentication),
                        request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PatchMapping("/{ticketId}/assign")
    public ResponseEntity<TicketResponse> assignTicekt(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketAssignRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.assignTicekt(
                        ticketId,
                        request,
                        authentication.getName(),
                        getRole(authentication)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT')")
    @PatchMapping("/{ticketId}/status")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketStatusRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.updateStatus(
                        ticketId,
                        authentication.getName(),
                        getRole(authentication),
                        request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT')")
    @PatchMapping("/{ticketId}/priority")
    public ResponseEntity<TicketResponse> updatePriority(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketPriorityRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                ticketService.updatePeriority(
                        ticketId,
                        authentication.getName(),
                        getRole(authentication),
                        request));
    }

    private String getRole(Authentication authentication) {

        return authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority();
    }
}