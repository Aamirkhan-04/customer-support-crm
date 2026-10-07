package com.datastraw.crm.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTicketNotFound(
            TicketNotFoundException exception) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(
            UserAlreadyExistsException exception) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage());
    }

    @ExceptionHandler(CustomerAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleCustomerAlreadyExists(
            CustomerAlreadyExistsException exception) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                exception.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
            UserNotFoundException exception) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage());
    }

    @ExceptionHandler(CustomerNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCustomerNotFound(
            CustomerNotFoundException exception) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage());
    }

    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCommentNotFound(
            CommentNotFoundException exception) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage());
    }

    @ExceptionHandler(AttachmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAttachmentNotFound(
            AttachmentNotFoundException exception) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage());
    }

    @ExceptionHandler(FileValidationException.class)
    public ResponseEntity<ErrorResponse> handleFileValidation(
            FileValidationException exception) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException exception) {

        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password");
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabledUser(
            DisabledException exception) {

        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "User account is disabled");
    }

    @ExceptionHandler(InvalidManagerException.class)
    public ResponseEntity<ErrorResponse> handleInvalidManager(
            InvalidManagerException exception) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage());
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponse> handleFileStorage(
            FileStorageException exception) {

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException exception) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()));

        ValidationErrorResponse response =
                new ValidationErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        "Validation failed",
                        errors,
                        LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus status,
            String message) {

        ErrorResponse errorResponse =
                new ErrorResponse(
                        status.value(),
                        message,
                        LocalDateTime.now());

        return ResponseEntity
                .status(status)
                .body(errorResponse);
    }
}