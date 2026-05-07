package com.secondlife.backend.common.exception;

public class BadRequestException extends AppException {
    public BadRequestException(String message) {
        super(400, message);
    }
}
