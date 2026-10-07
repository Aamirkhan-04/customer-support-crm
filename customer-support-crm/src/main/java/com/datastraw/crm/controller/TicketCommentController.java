package com.datastraw.crm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.datastraw.crm.dto.comment.CommentRequest;
import com.datastraw.crm.dto.comment.CommentResponse;
import com.datastraw.crm.service.TicketCommentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearer-key")
@RequiredArgsConstructor
public class TicketCommentController {
	
	private final TicketCommentService ticketCommentService;
	
	@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
	@PostMapping("/tickets/{ticketId}/comments")
	public ResponseEntity<CommentResponse> addComment(
			@PathVariable String ticketId, 
			@Valid @RequestBody CommentRequest request,
			Authentication authentication){
		
		 CommentResponse responce = ticketCommentService
		         .addComment(ticketId, authentication.getName(), request);
		 
		 return ResponseEntity
				 .status(HttpStatus.CREATED).body(responce);
	}
	
	@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
	@GetMapping("/tickets/{ticketId}/comments")
	public ResponseEntity<List<CommentResponse>> getComments(
			@PathVariable String ticketId, Authentication authentication){
		
		return ResponseEntity.ok(
				ticketCommentService.getComments(ticketId,authentication.getName()));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
	@PutMapping("/comments/{commentId}")
	public ResponseEntity<CommentResponse> updateComment(
			@PathVariable Long commentId,
			@Valid @RequestBody CommentRequest request,
			Authentication authentication){
		
		return ResponseEntity.ok(
				ticketCommentService.updateComment(commentId,
						authentication.getName(),request));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
	@DeleteMapping("/comments/{commentId}")
	public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
			Authentication authentication){
		
		ticketCommentService.deleteComment(commentId, authentication.getName());
		
		return ResponseEntity.noContent().build();
	}
}
