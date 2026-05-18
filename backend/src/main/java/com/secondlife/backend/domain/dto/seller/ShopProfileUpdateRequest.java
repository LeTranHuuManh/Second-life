package com.secondlife.backend.domain.dto.seller;

import lombok.Data;

@Data
public class ShopProfileUpdateRequest {
    private String shopName;
    private String description;
    private String phone;
    private String address;
}
