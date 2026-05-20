package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.ProductRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {
    List<ProductRating> findByProductId(Long productId);
    List<ProductRating> findByUserId(Long userId);
    java.util.Optional<ProductRating> findByProductIdAndUserId(Long productId, Long userId);    boolean existsByProductIdAndUserId(Long productId, Long userId);

    @Query("SELECT AVG(r.rating) FROM ProductRating r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(Long productId);

    long countByProductId(Long productId);
}
