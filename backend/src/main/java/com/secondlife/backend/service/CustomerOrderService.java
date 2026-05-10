package com.secondlife.backend.service;

import com.secondlife.backend.dto.order.OrderCreateRequest;
import com.secondlife.backend.dto.order.OrderResponse;
import java.util.List;

public interface CustomerOrderService {
    List<OrderResponse> createOrder(Long userId, OrderCreateRequest request);
    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getUserOrders(Long userId);
}
