package com.datastraw.crm.exception;

@SuppressWarnings("serial")
public class AttachmentNotFoundException extends RuntimeException{

	public AttachmentNotFoundException(String message) {
		super(message);
	}
}
