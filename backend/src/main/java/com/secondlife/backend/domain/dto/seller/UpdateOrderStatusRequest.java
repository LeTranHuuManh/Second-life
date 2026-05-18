package com.secondlife.backend.domain.dto.seller;

import com.secondlife.backend.domain.enums.OrderStatus;

public class UpdateOrderStatusRequest {
    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
