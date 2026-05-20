package com.secondlife.backend.controller;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.product.ProductRatingRequest;
import com.secondlife.backend.domain.dto.product.ProductRatingResponse;
import com.secondlife.backend.service.ProductRatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/ratings")
@RequiredArgsConstructor
public class ProductRatingController {

    private final ProductRatingService productRatingService;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<BaseResponse<ProductRatingResponse>> addRating(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRatingRequest request) {

        Long userId = getCurrentUserId();
        ProductRatingResponse response = productRatingService.addRating(productId, userId, request);
        return ResponseEntity.ok(BaseResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<ProductRatingResponse>>> getRatingsByProductId(
            @PathVariable Long productId) {
        
        List<ProductRatingResponse> responses = productRatingService.getRatingsByProductId(productId);
        return ResponseEntity.ok(BaseResponse.success(responses));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<BaseResponse<Void>> deleteRating(
            @PathVariable Long productId,
            @PathVariable Long ratingId) {
            
        Long userId = getCurrentUserId();
        productRatingService.deleteRating(ratingId, userId);
        return ResponseEntity.ok(BaseResponse.success(null));
    }
}
