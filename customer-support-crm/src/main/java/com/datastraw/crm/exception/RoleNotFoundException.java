package com.datastraw.crm.exception;

@SuppressWarnings("serial")
public class RoleNotFoundException extends RuntimeException{

	public RoleNotFoundException(String message) {
		super(message);
	}
}
