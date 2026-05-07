package com.secondlife.backend.common.exception;

public class ForbiddenException extends AppException {
    public ForbiddenException(String message) {
        super(403, message);
    }

    public ForbiddenException() {
        super(403, "Bạn không có quyền truy cập tài nguyên này");
    }
}
