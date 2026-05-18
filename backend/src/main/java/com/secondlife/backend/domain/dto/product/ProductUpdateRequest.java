package com.secondlife.backend.domain.dto.product;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductUpdateRequest {

    @NotBlank(message = "Noi dung title khong duoc de trong")
    private String title;

    private String description;

    private BigDecimal price;

    private BigDecimal rentalPricePerDay;

    @NotBlank(message = "Tinh trang san pham khong duoc de trong")
    private String condition;

    private String location;
    private Integer stocks;

    @NotBlank(message = "Loai hinh dang (Ban / Cho thue / Ca hai) khong duoc de trong")
    private String listingType;

    @NotNull(message = "ID danh muc khong duoc de trong")
    private Long categoryId;

    private List<String> images;
}
