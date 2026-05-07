package com.secondlife.backend.domain.dto.product;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal rentalPricePerDay;
    private String condition;
    private String location;
    private String listingType;
    private String status;
    private Long categoryId;
    private Long sellerId;
    private List<String> images;
}