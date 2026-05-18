package com.secondlife.backend.domain.dto.seller;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SellerRegistrationRequest {
    @NotBlank(message = "Tên cửa hàng không được để trống")
    private String shopName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotBlank(message = "Mô tả cửa hàng không được để trống")
    private String description;
}
