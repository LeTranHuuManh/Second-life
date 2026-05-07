package com.secondlife.backend.domain.dto.seller;

import com.secondlife.backend.domain.enums.RegistrationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRegistrationRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private RegistrationStatus status;

    private String adminNote;
}
