package com.secondlife.backend.domain.dto.seller;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ShopProfileResponse {
    private Long id;
    private String name;
    private String avatar;
    private String coverImage;
    private String address;
    private long totalOrders;
    private long totalProducts;
    private String joinedDate;
    private BigDecimal rating;
    private Long ratingCount;
    private String description;
    private String responseRate;
    private String responseTime;
}
