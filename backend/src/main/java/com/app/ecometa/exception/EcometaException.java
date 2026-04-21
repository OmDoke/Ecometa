package com.app.ecometa.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class EcometaException extends RuntimeException {
    public EcometaException(String message) {
        super(message);
    }
}
