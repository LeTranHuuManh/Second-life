package com.secondlife.backend.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse<T> {
    private int code;
    private String message;
    private T data;
    private Long timestamp;

    public static <T> BaseResponse<T> success(T data) {
        return BaseResponse.<T>builder()
                .code(200)
                .message("Thành công")
                .data(data)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    public static <T> BaseResponse<T> success(String message, T data) {
        return BaseResponse.<T>builder()
                .code(200)
                .message(message)
                .data(data)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    public static <T> BaseResponse<T> error(int code, String message) {
        return BaseResponse.<T>builder()
                .code(code)
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    public static <T> BaseResponse<T> badRequest(String message) {
        return error(400, message);
    }

    public static <T> BaseResponse<T> unauthorized(String message) {
        return error(401, message);
    }

    public static <T> BaseResponse<T> forbidden(String message) {
        return error(403, message);
    }

    public static <T> BaseResponse<T> notFound(String message) {
        return error(404, message);
    }

    public static <T> BaseResponse<T> internalError(String message) {
        return error(500, message);
    }
}
