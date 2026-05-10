package com.secondlife.backend.domain.dto.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SellerInfo {
    private Long id;
    private String fullName;
    private String avatarUrl;
    private String address;
    private String joinedAt;
    private Long totalOrders;
    private BigDecimal rating;
}
