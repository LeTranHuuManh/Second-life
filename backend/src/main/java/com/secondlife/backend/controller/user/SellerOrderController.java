package com.secondlife.backend.controller.user;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.seller.SellerOrderResponse;
import com.secondlife.backend.service.seller.SellerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
public class SellerOrderController {

    private final SellerOrderService sellerOrderService;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<BaseResponse<List<SellerOrderResponse>>> getSellerOrders() {
        Long sellerId = getCurrentUserId();
        List<SellerOrderResponse> orders = sellerOrderService.getSellerOrders(sellerId);
        return ResponseEntity.ok(BaseResponse.success(orders));
    }

    @GetMapping("/paged")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<BaseResponse<Page<SellerOrderResponse>>> getSellerOrdersPaged(Pageable pageable) {
        Long sellerId = getCurrentUserId();
        Page<SellerOrderResponse> orders = sellerOrderService.getSellerOrdersPaged(sellerId, pageable);
        return ResponseEntity.ok(BaseResponse.success(orders));
    }

    @PostMapping("/{orderItemId}/approve")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<BaseResponse<String>> approveOrder(@PathVariable Long orderItemId) {
        Long sellerId = getCurrentUserId();
        sellerOrderService.approveOrder(sellerId, orderItemId);
        return ResponseEntity.ok(BaseResponse.success("Order approved successfully"));
    }
}
