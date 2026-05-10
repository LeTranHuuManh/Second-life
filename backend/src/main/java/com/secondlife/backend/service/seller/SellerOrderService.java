package com.secondlife.backend.service.seller;

import com.secondlife.backend.domain.dto.seller.SellerOrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SellerOrderService {
    List<SellerOrderResponse> getSellerOrders(Long sellerId);
    Page<SellerOrderResponse> getSellerOrdersPaged(Long sellerId, Pageable pageable);
    void approveOrder(Long sellerId, Long orderItemId);
}
