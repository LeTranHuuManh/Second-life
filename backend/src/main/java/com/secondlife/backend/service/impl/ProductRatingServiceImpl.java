package com.secondlife.backend.service.impl;

import com.secondlife.backend.common.exception.AppException;
import com.secondlife.backend.domain.dto.product.ProductRatingRequest;
import com.secondlife.backend.domain.dto.product.ProductRatingResponse;
import com.secondlife.backend.domain.model.Product;
import com.secondlife.backend.domain.model.ProductRating;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.repository.ProductRatingRepository;
import com.secondlife.backend.repository.ProductRepository;
import com.secondlife.backend.repository.UserAccountRepository;
import com.secondlife.backend.service.ProductRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductRatingServiceImpl implements ProductRatingService {

    private final ProductRatingRepository productRatingRepository;
    private final ProductRepository productRepository;
    private final UserAccountRepository userAccountRepository;

    @Override
    @Transactional
    public ProductRatingResponse addRating(Long productId, Long userId, ProductRatingRequest request) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Product not found"));

        UserAccount user = userAccountRepository.findById(userId)
            .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "User not found"));

        Optional<ProductRating> existingRatingOpt = productRatingRepository.findByProductIdAndUserId(productId, userId);
        ProductRating rating;
        if (existingRatingOpt.isPresent()) {
            rating = existingRatingOpt.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
            if (request.getImageUrl() != null) {
                rating.setImageUrl(request.getImageUrl());
            }
        } else {
            rating = new ProductRating();
            rating.setProduct(product);
            rating.setUser(user);
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
            rating.setImageUrl(request.getImageUrl());
        }

        rating = productRatingRepository.save(rating);

        // Update product average rating
        Double avgRating = productRatingRepository.getAverageRatingByProductId(productId);
        long count = productRatingRepository.countByProductId(productId);
        product.setAverageRating(Math.round(avgRating * 10.0) / 10.0);
        product.setReviewCount((int) count);
        productRepository.save(product);

        return mapToResponse(rating);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductRatingResponse> getRatingsByProductId(Long productId) {
        return productRatingRepository.findByProductId(productId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductRatingResponse> getRatingsByUserId(Long userId) {
        return productRatingRepository.findByUserId(userId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteRating(Long ratingId, Long userId) {
        ProductRating rating = productRatingRepository.findById(ratingId)
            .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Rating not found"));

        if (!rating.getUser().getId().equals(userId)) {
            throw new AppException(HttpStatus.FORBIDDEN.value(), "You are not allowed to delete this rating.");
        }

        Long productId = rating.getProduct().getId();
        productRatingRepository.delete(rating);
        
        productRatingRepository.flush(); // Ensure deletion is flushed before calculating avg

        // Update product average rating
        Product product = productRepository.findById(productId).orElseThrow();
        Double avgRating = productRatingRepository.getAverageRatingByProductId(productId);
        long count = productRatingRepository.countByProductId(productId);
        product.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        product.setReviewCount((int) count);
        productRepository.save(product);
    }

    private ProductRatingResponse mapToResponse(ProductRating rating) {
        ProductRatingResponse response = new ProductRatingResponse();
        response.setId(rating.getId());
        response.setProductId(rating.getProduct().getId());
        
        UserAccount user = rating.getUser();
        response.setUserId(user.getId());
        if (user.getProfile() != null) {
            response.setUserName(user.getProfile().getFullName() != null ? user.getProfile().getFullName() : user.getProfile().getEmail());
            response.setUserAvatar(user.getProfile().getAvatarUrl());
        }
        
        response.setRating(rating.getRating());
        response.setImageUrl(rating.getImageUrl());
        response.setComment(rating.getComment());
        response.setCreatedAt(rating.getCreatedAt());
        response.setUpdatedAt(rating.getUpdatedAt());
        return response;
    }
}
