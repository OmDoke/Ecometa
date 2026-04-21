package com.app.ecometa.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends EcometaException {
    public ConflictException(String message) {
        super(message);
    }
}
