package com.datastraw.crm.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.datastraw.crm.dto.attachment.dto.AttachmentResponse;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.entity.TicketAttachment;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.exception.TicketNotFoundException;
import com.datastraw.crm.exception.UserNotFoundException;
import com.datastraw.crm.repository.TicketRepository;
import com.datastraw.crm.repository.UserRepository;
import com.datastraw.crm.service.FileStorageService;
import com.datastraw.crm.service.TicketAttachmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearer-key")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AttachmentController {

    private final TicketAttachmentService ticketAttachmentService;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Operation(summary = "Upload attachment")
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping(
            value = "/tickets/{ticketId}/attachments",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> uploadAttachment(
            @PathVariable String ticketId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        Ticket ticket = findTicket(ticketId);
        User user = findUser(authentication);

        AttachmentResponse response =
                ticketAttachmentService.addAttachment(
                        ticket,
                        user,
                        file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
    @GetMapping("/tickets/{ticketId}/attachments")
    public ResponseEntity<List<AttachmentResponse>> getAttachment(
            @PathVariable String ticketId,
            Authentication authentication) {

        Ticket ticket = findTicket(ticketId);

        User user = findUser(authentication);

        List<AttachmentResponse> attachments =
                ticketAttachmentService.getAttachments(
                        ticket,
                        user);

        return ResponseEntity.ok(attachments);
    }

    @Operation(summary = "View attachment")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<Resource> viewAttachment(
            @PathVariable Long attachmentId,
            Authentication authentication) {

        User user = findUser(authentication);

        TicketAttachment attachment =
                ticketAttachmentService.getAttachment(
                        attachmentId,
                        user);

        Resource resource =
                fileStorageService.loadFile(
                        attachment.getFileUrl());

        MediaType mediaType =
                MediaType.APPLICATION_OCTET_STREAM;

        if (attachment.getContentType() != null) {

            try {
                mediaType =
                        MediaType.parseMediaType(
                                attachment.getContentType());
            } catch (IllegalArgumentException e) {
                mediaType =
                        MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(mediaType);

        headers.setContentDisposition(
                ContentDisposition
                        .inline()
                        .filename(
                                attachment.getFileName())
                        .build());

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(resource);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long attachmentId,
            Authentication authentication) {

        User user = findUser(authentication);

        ticketAttachmentService.deleteAttachment(
                attachmentId,
                user);

        return ResponseEntity.noContent().build();
    }

    private Ticket findTicket(String ticketId) {

        return ticketRepository.findByTicketId(ticketId)
                .orElseThrow(() ->
                        new TicketNotFoundException(
                                "Ticket not found: " + ticketId));
    }

    private User findUser(Authentication authentication) {

        return userRepository.findByEmail(
                authentication.getName())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found: "
                                        + authentication.getName()));
    }
}