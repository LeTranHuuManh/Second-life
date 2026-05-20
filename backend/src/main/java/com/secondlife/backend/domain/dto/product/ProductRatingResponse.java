package com.secondlife.backend.domain.dto.product;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProductRatingResponse {
    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private String userAvatar;    private Integer rating;
    private String imageUrl;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
