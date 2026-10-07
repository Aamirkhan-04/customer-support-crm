package com.datastraw.crm.exception;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ValidationErrorResponse {

	private int status;
	private String message;
	private Map<String, String>errors;
	private LocalDateTime timestamp;
	
}
