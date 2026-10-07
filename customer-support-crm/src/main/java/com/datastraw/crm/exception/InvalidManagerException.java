package com.datastraw.crm.exception;

@SuppressWarnings("serial")
public class InvalidManagerException extends RuntimeException{

	public InvalidManagerException(String message) {
		super(message);
	}
}
