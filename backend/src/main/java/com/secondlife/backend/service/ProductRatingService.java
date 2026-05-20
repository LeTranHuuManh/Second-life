package com.secondlife.backend.service;

import com.secondlife.backend.domain.dto.product.ProductRatingRequest;
import com.secondlife.backend.domain.dto.product.ProductRatingResponse;

import java.util.List;

public interface ProductRatingService {
    ProductRatingResponse addRating(Long productId, Long userId, ProductRatingRequest request);
    List<ProductRatingResponse> getRatingsByProductId(Long productId);
    List<ProductRatingResponse> getRatingsByUserId(Long userId);
    void deleteRating(Long ratingId, Long userId);
}
