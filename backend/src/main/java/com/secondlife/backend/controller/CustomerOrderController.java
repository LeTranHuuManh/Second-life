package com.secondlife.backend.controller;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.dto.order.OrderCreateRequest;
import com.secondlife.backend.dto.order.OrderResponse;
import com.secondlife.backend.service.CustomerOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final CustomerOrderService orderService;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<BaseResponse<List<OrderResponse>>> createOrder(
            @Valid @RequestBody OrderCreateRequest request) {
        List<OrderResponse> responseList = orderService.createOrder(getCurrentUserId(), request);
        return ResponseEntity.ok(BaseResponse.success(responseList));
    }

    @GetMapping("/me")
    public ResponseEntity<BaseResponse<List<OrderResponse>>> getMyOrders() {
        List<OrderResponse> orders = orderService.getUserOrders(getCurrentUserId());
        return ResponseEntity.ok(BaseResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        // Note: For production, ensure the current user owns this order before returning.
        return ResponseEntity.ok(BaseResponse.success(response));
    }
}
