package com.secondlife.backend.domain.dto.product;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductCreateRequest {
    
    @NotBlank(message = "Nội dung title không được để trống")
    private String title;
    
    private String description;
    
    private BigDecimal price;
    
    private BigDecimal rentalPricePerDay;
    
    @NotBlank(message = "Tình trạng sản phẩm không được để trống")
    private String condition;
    
    private String location;
    
    @NotBlank(message = "Loại hình đăng (Bán / Cho thuê / Cả hai) không được để trống")
    private String listingType;

    @NotNull(message = "ID danh mục không được để trống")
    private Long categoryId;
    
    private List<String> images;
}
