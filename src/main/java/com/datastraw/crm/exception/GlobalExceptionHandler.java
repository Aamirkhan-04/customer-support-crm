package com.datastraw.crm.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(TicketNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleTicektException(
			TicketNotFoundException exception){
		
		 ErrorResponse errorResponse = new ErrorResponse(
	                HttpStatus.NOT_FOUND.value(),
	                exception.getMessage(),
	                LocalDateTime.now()
	        );
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	}
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ValidationErrorResponse> handleValidationException(
			MethodArgumentNotValidException exception){
		
		Map<String, String> errors=new HashMap<>();
		
		exception.getBindingResult()
		.getFieldErrors()
		 .forEach(error ->
		     errors.put(error.getField(),
		    		 error.getDefaultMessage()));
		ValidationErrorResponse response=new ValidationErrorResponse(
			HttpStatus.BAD_REQUEST.value(),
			"Validation failed",
			errors,
			LocalDateTime.now());
	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);			
	}
	
	@ExceptionHandler(IllegalArgumentException .class)
	public ResponseEntity<ErrorResponse>handleIllegalArgumentException(
			IllegalArgumentException exception){
		
		ErrorResponse errorResponse=new ErrorResponse(
				HttpStatus.BAD_REQUEST.value(),
				 "Invalid status. Allowed values: Open, In Progress, Closed",
				 LocalDateTime.now());
		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
				
	}
}
