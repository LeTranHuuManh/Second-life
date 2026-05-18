package com.secondlife.backend.domain.dto.seller;

import com.secondlife.backend.domain.enums.RegistrationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SellerRegistrationResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userFullName;
    private String shopName;
    private String phone;
    private String address;
    private String description;
    private String avatarUrl;
    private String coverImageUrl;
    private RegistrationStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
