package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.Product;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.domain.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByStatusOrderByCreatedAtDesc(ProductStatus status, Pageable pageable);
    Page<Product> findBySellerOrderByCreatedAtDesc(UserAccount seller, Pageable pageable);
    long countBySeller_Id(Long sellerId);
}
