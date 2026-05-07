package com.secondlife.backend.common.exception;

public class UnauthorizedException extends AppException {
    public UnauthorizedException(String message) {
        super(401, message);
    }

    public UnauthorizedException() {
        super(401, "Bạn chưa đăng nhập");
    }
}
