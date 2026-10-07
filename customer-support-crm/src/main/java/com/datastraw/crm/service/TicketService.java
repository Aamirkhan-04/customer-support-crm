package com.datastraw.crm.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.datastraw.crm.dto.ticketdto.TicketAssignRequest;
import com.datastraw.crm.dto.ticketdto.TicketCreateRequest;
import com.datastraw.crm.dto.ticketdto.TicketPriorityRequest;
import com.datastraw.crm.dto.ticketdto.TicketResponse;
import com.datastraw.crm.dto.ticketdto.TicketStatusRequest;
import com.datastraw.crm.dto.ticketdto.TicketUpdateRequest;
import com.datastraw.crm.dto.userdto.UserResponse;
import com.datastraw.crm.entity.Customer;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.enums.RoleName;
import com.datastraw.crm.enums.TicketPriority;
import com.datastraw.crm.enums.TicketStatus;
import com.datastraw.crm.exception.CustomerNotFoundException;
import com.datastraw.crm.exception.TicketNotFoundException;
import com.datastraw.crm.exception.UserNotFoundException;
import com.datastraw.crm.repository.CustomerRepository;
import com.datastraw.crm.repository.TicketRepository;
import com.datastraw.crm.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final TicketAccessService ticketAccessService;

    // 1. Create Ticket
    public TicketResponse createTicket(
            String email,
            String role,
            TicketCreateRequest request) {

        Customer customer;

        if (role.equals("ROLE_CUSTOMER")) {

            customer = customerRepository
                    .findByUser_Email(email)
                    .orElseThrow(() ->
                            new CustomerNotFoundException(
                                    "Customer profile not found"));

        } else {

            customer = customerRepository
                    .findById(request.getCustomerId())
                    .orElseThrow(() ->
                            new CustomerNotFoundException(
                                    "Customer not found: "
                                            + request.getCustomerId()));
        }

        Ticket ticket = new Ticket();

        ticket.setCustomer(customer);
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);

        return toResponse(
                ticketRepository.save(ticket));
    }

    // 2. Get All Tickets
    public List<TicketResponse> getAllTickets(
            String email,
            String role,
            String search,
            TicketStatus status,
            TicketPriority priority) {

        List<Ticket> tickets =
                ticketRepository.findAll();

        if ("ROLE_CUSTOMER".equals(role)) {

            tickets = tickets.stream()
                    .filter(ticket ->
                            ticket.getCustomer()
                                    .getUser()
                                    .getEmail()
                                    .equals(email))
                    .toList();
        }

        // Manager Role
        if ("ROLE_MANAGER".equals(role)) {

            User manager = findUserByEmail(email);

            tickets = ticketRepository
                    .findByAssignedAgent_Manager_Id(
                            manager.getId());
        }

        if ("ROLE_AGENT".equals(role)) {

            tickets = tickets.stream()
                    .filter(ticket ->
                            ticket.getAssignedAgent() != null
                                    && ticket.getAssignedAgent()
                                            .getEmail()
                                            .equals(email))
                    .toList();
        }

        if (search != null && !search.isBlank()) {

            String text = search.toLowerCase();

            tickets = tickets.stream()
                    .filter(ticket ->
                            ticket.getTicketId()
                                    .toLowerCase()
                                    .contains(text)
                                    || ticket.getCustomer()
                                            .getName()
                                            .toLowerCase()
                                            .contains(text)
                                    || ticket.getCustomer()
                                            .getEmail()
                                            .toLowerCase()
                                            .contains(text)
                                    || ticket.getDescription()
                                            .toLowerCase()
                                            .contains(text))
                    .toList();
        }

        if (status != null) {

            tickets = tickets.stream()
                    .filter(ticket ->
                            ticket.getStatus() == status)
                    .toList();
        }

        if (priority != null) {

            tickets = tickets.stream()
                    .filter(ticket ->
                            ticket.getPriority() == priority)
                    .toList();
        }

        return tickets.stream()
                .map(this::toResponse)
                .toList();
    }

    // 3. Get Ticket By ID
    public TicketResponse getTicketById(
            String ticketId,
            String email,
            String role) {

        Ticket ticket =
                findTicketById(ticketId);

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UserNotFoundException(
                                        "User not found: "
                                                + email));

        ticketAccessService.checkTicketAccess(
                ticket,
                user);

        return toResponse(ticket);
    }

    // 4. Update Ticket
    public TicketResponse updateTicket(
            String ticketId,
            String email,
            String role,
            TicketUpdateRequest request) {

        Ticket ticket =
                findTicketById(ticketId);

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UserNotFoundException(
                                        "User not found: "
                                                + email));

        ticketAccessService.checkTicketAccess(
                ticket,
                user);

        ticket.setSubject(
                request.getSubject());

        ticket.setDescription(
                request.getDescription());

        return toResponse(
                ticketRepository.save(ticket));
    }

    // 5. Assign Ticket
    public TicketResponse assignTicekt(
            String ticketId,
            TicketAssignRequest request,
            String email,
            String role) {

        Ticket assignTicket =
                findTicketById(ticketId);

        User agent =
                userRepository.findById(
                        request.getAssignedAgentId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Agent not found"));

        if (agent.getRole().getName()
                != RoleName.AGENT) {

            throw new IllegalArgumentException(
                    "Selected user is not an agent");
        }

        if ("ROLE_MANAGER".equals(role)) {

            User manager =
                    findUserByEmail(email);

            ticketAccessService.checkTicketAccess(
                    assignTicket,
                    manager);

            if (agent.getManager() == null
                    || !agent.getManager()
                            .getId()
                            .equals(manager.getId())) {

                throw new IllegalArgumentException(
                        "Selected agent is not in your team");
            }
        }

        assignTicket.setAssignedAgent(agent);

        return toResponse(
                ticketRepository.save(assignTicket));
    }

    // 6. Get Manager Team Agents
    public List<UserResponse> getManagerTeamAgents(
            String managerEmail) {

        User manager =
                findUserByEmail(managerEmail);

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole()
                                .getName()
                                == RoleName.AGENT)
                .filter(user ->
                        user.getManager() != null
                                && user.getManager()
                                        .getId()
                                        .equals(manager.getId()))
                .map(this::toUserResponse)
                .toList();
    }

    // 7. Update Status
    public TicketResponse updateStatus(
            String ticketId,
            String email,
            String role,
            TicketStatusRequest request) {

        Ticket ticket =
                findTicketById(ticketId);

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UserNotFoundException(
                                        "User not found: "
                                                + email));

        ticketAccessService.checkTicketAccess(
                ticket,
                user);

        ticket.setStatus(
                request.getStatus());

        return toResponse(
                ticketRepository.save(ticket));
    }

    // 8. Update Priority
    public TicketResponse updatePeriority(
            String ticketId,
            String email,
            String role,
            TicketPriorityRequest request) {

        Ticket ticket =
                findTicketById(ticketId);

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UserNotFoundException(
                                        "User not found: "
                                                + email));

        ticketAccessService.checkTicketAccess(
                ticket,
                user);

        ticket.setPriority(
                request.getPriority());

        return toResponse(
                ticketRepository.save(ticket));
    }

    private Ticket findTicketById(
            String ticketId) {

        return ticketRepository
                .findByTicketId(ticketId)
                .orElseThrow(() ->
                        new TicketNotFoundException(
                                "Ticket not found: "
                                        + ticketId));
    }

    private User findUserByEmail(
            String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found: "
                                        + email));
    }

    private TicketResponse toResponse(
            Ticket ticket) {

        return new TicketResponse(
                ticket.getId(),
                ticket.getTicketId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCustomer().getName(),
                ticket.getAssignedAgent() == null
                        ? null
                        : ticket.getAssignedAgent()
                                .getUsername(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt());
    }

    private UserResponse toUserResponse(
            User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName(),
                user.isEnable());
    }
}