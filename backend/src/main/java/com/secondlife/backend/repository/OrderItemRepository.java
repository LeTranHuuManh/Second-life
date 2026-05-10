package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find all order items where the product's seller matches the given sellerId
    List<OrderItem> findByProduct_Seller_IdOrderByOrder_CreatedAtDesc(Long sellerId);
    
    Page<OrderItem> findByProduct_Seller_IdOrderByOrder_CreatedAtDesc(Long sellerId, Pageable pageable);
}
