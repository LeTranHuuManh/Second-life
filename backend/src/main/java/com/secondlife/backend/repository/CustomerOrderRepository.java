package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    @Query("SELECT COUNT(DISTINCT o.id) FROM CustomerOrder o JOIN o.items i WHERE i.product.seller.id = :sellerId")
    long countOrdersBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT SUM(i.priceAtPurchase) FROM OrderItem i WHERE i.product.seller.id = :sellerId")
    BigDecimal sumRevenueBySellerId(@Param("sellerId") Long sellerId);
}
