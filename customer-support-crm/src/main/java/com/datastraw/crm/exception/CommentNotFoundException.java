package com.datastraw.crm.exception;

@SuppressWarnings("serial")
public class CommentNotFoundException extends RuntimeException{

	public CommentNotFoundException(String message) {
		super(message);
	}
}
