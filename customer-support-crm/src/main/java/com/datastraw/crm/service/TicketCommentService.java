package com.datastraw.crm.service;

import java.util.List; 
import org.springframework.stereotype.Service;
import com.datastraw.crm.dto.comment.CommentRequest;
import com.datastraw.crm.dto.comment.CommentResponse;
import com.datastraw.crm.entity.Ticket;
import com.datastraw.crm.entity.TicketComment;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.enums.RoleName;
import com.datastraw.crm.exception.CommentNotFoundException;
import com.datastraw.crm.exception.TicketNotFoundException;
import com.datastraw.crm.exception.UserNotFoundException;
import com.datastraw.crm.repository.TicketCommentRepository;
import com.datastraw.crm.repository.TicketRepository;
import com.datastraw.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketCommentService {

    private final TicketCommentRepository ticketCommentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketAccessService ticketAccessService;

    // Add Comment
    public CommentResponse addComment(String ticketId,String email,
            CommentRequest request) {

        Ticket ticket = findTicketById(ticketId);
        User user = findUserByEmail(email);

        ticketAccessService.checkTicketAccess(ticket, user);

        TicketComment ticketComment = new TicketComment();

        ticketComment.setTicket(ticket);
        ticketComment.setUser(user);
        ticketComment.setComment(request.getComment());

        TicketComment savedComment =
                ticketCommentRepository.save(ticketComment);

        return toResponse(savedComment);
    }

    // Get Comments
    public List<CommentResponse> getComments(String ticketId,String email) {

        Ticket ticket = findTicketById(ticketId);
        User user = findUserByEmail(email);

        ticketAccessService.checkTicketAccess(ticket, user);

        return ticketCommentRepository
                .findByTicket_IdOrderByCreatedAtAsc(ticket.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Update Comment
    public CommentResponse updateComment(Long commentId,String email,
            CommentRequest request) {

        TicketComment comment =
                findCommentByIdAndEmail(commentId, email);

        comment.setComment(request.getComment());

        TicketComment updatedComment =
                ticketCommentRepository.save(comment);

        return toResponse(updatedComment);
    }

    // Delete Comment
    public void deleteComment(Long commentId,String email) {

        TicketComment deletedComment =
                findCommentByIdAndEmail(commentId, email);

        ticketCommentRepository.delete(deletedComment);
    }
    
    // Helper Method
    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found: " + email));
    }

    // Helper Method
    private Ticket findTicketById(String ticketId) {

        return ticketRepository.findByTicketId(ticketId)
                .orElseThrow(() ->
                        new TicketNotFoundException(
                                "Ticket not found: " + ticketId));
    }

    // Helper Method
    private TicketComment findCommentByIdAndEmail(Long commentId,String email) {

        User user = findUserByEmail(email);

        TicketComment comment =
                ticketCommentRepository.findById(commentId)
                        .orElseThrow(() ->
                                new CommentNotFoundException(
                                        "Comment not found: " + commentId));

        // ADMIN can update/delete any comment
        if (user.getRole().getName() == RoleName.ADMIN) {
            return comment;
        }
        // MANAGER can update/delete comments
        // on tickets they can access
        if (user.getRole().getName() == RoleName.MANAGER) {

            ticketAccessService.checkTicketAccess(
                    comment.getTicket(),user);
            return comment;
        }
        // AGENT and CUSTOMER can update/delete
        // only their own comment
        if (!comment.getUser().getEmail().equals(user.getEmail())) {

            throw new CommentNotFoundException(
                    "Comment not found: " + commentId);
        }

        ticketAccessService.checkTicketAccess(
                comment.getTicket(),
                user);

        return comment;
    }

    // Helper Method
    private CommentResponse toResponse(
            TicketComment comment) {

        return new CommentResponse(
                comment.getId(),
                comment.getComment(),
                comment.getUser().getUsername(),
                comment.getUser().getRole().getName().name(),
                comment.getCreatedAt());
    }
}