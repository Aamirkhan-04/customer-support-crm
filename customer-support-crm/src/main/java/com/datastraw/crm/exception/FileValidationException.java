package com.datastraw.crm.exception;

@SuppressWarnings("serial")
public class FileValidationException extends RuntimeException{

	public FileValidationException(String message) {
		super(message);
	}
}
