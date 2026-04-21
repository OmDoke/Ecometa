package com.app.ecometa.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends EcometaException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
