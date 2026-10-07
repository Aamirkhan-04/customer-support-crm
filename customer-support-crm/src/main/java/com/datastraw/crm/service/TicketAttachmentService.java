package com.datastraw.crm.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.datastraw.crm.dto.attachment.dto.AttachmentResponse;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.entity.TicketAttachment;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.exception.AttachmentNotFoundException;
import com.datastraw.crm.repository.TicketAttachmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketAttachmentService {

    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final FileStorageService fileStorageService;
    private final TicketAccessService ticketAccessService;

    public AttachmentResponse addAttachment(
            Ticket ticket,
            User user,
            MultipartFile file) {

        ticketAccessService.checkTicketAccess(ticket, user);

        fileStorageService.validateFile(file);

        String fileName =
                fileStorageService.saveFile(file);

        TicketAttachment attachment =
                new TicketAttachment();

        attachment.setTicket(ticket);
        attachment.setUploadedBy(user);
        attachment.setFileName(
                file.getOriginalFilename());
        attachment.setFileUrl(
                "/uploads/" + fileName);
        attachment.setContentType(
                file.getContentType());
        attachment.setFileSize(
                file.getSize());
        attachment.setCreatedAt(
                LocalDateTime.now());

        TicketAttachment savedAttachment =
                ticketAttachmentRepository.save(
                        attachment);

        return mapToResponce(savedAttachment);
    }

    public List<AttachmentResponse> getAttachments(
            Ticket ticket,
            User user) {

        ticketAccessService.checkTicketAccess(
                ticket,
                user);

        return ticketAttachmentRepository
                .findByTicketId(ticket.getId())
                .stream()
                .map(this::mapToResponce)
                .toList();
    }

    public TicketAttachment getAttachment(
            Long attachmentId,
            User user) {

        TicketAttachment attachment =
                ticketAttachmentRepository
                        .findById(attachmentId)
                        .orElseThrow(() ->
                                new AttachmentNotFoundException(
                                        "Attachment not found: "
                                                + attachmentId));

        ticketAccessService.checkTicketAccess(
                attachment.getTicket(),
                user);

        return attachment;
    }

    public void deleteAttachment(
            Long attachmentId,
            User user) {

        TicketAttachment attachment =
                ticketAttachmentRepository
                        .findById(attachmentId)
                        .orElseThrow(() ->
                                new AttachmentNotFoundException(
                                        "Attachment not found: "
                                                + attachmentId));

        ticketAccessService.checkTicketAccess(
                attachment.getTicket(),
                user);

        String fileName =
                attachment.getFileUrl()
                        .substring(
                                attachment.getFileUrl()
                                        .lastIndexOf("/") + 1);

        fileStorageService.deleteFile(fileName);

        ticketAttachmentRepository.delete(
                attachment);
    }

    private AttachmentResponse mapToResponce(
            TicketAttachment attachment) {

        return new AttachmentResponse(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getFileUrl(),
                attachment.getContentType(),
                attachment.getFileSize(),
                attachment.getUploadedBy().getId(),
                attachment.getCreatedAt());
    }
}