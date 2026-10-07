package com.datastraw.crm.exception;

@SuppressWarnings("serial")
public class CustomerAlreadyExistsException extends RuntimeException {

    public CustomerAlreadyExistsException(String message) {
        super(message);
    }
}