package com.secondlife.backend.domain.dto.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDetailResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal rentalPricePerDay;
    private String condition;
    private String location;
    private Integer stocks;
    private String listingType;
    private String status;
    private Long categoryId;
    private SellerInfo seller;
    private List<String> images;
}
