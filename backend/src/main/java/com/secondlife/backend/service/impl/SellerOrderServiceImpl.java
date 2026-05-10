package com.secondlife.backend.service.impl;

import com.secondlife.backend.domain.dto.seller.SellerOrderResponse;
import com.secondlife.backend.domain.enums.OrderStatus;
import com.secondlife.backend.domain.model.CustomerOrder;
import com.secondlife.backend.domain.model.OrderItem;
import com.secondlife.backend.repository.CustomerOrderRepository;
import com.secondlife.backend.repository.OrderItemRepository;
import com.secondlife.backend.service.seller.SellerOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SellerOrderServiceImpl implements SellerOrderService {

    private final OrderItemRepository orderItemRepository;
    private final CustomerOrderRepository customerOrderRepository;

    public SellerOrderServiceImpl(OrderItemRepository orderItemRepository, CustomerOrderRepository customerOrderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.customerOrderRepository = customerOrderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerOrderResponse> getSellerOrders(Long sellerId) {
        List<OrderItem> items = orderItemRepository.findByProduct_Seller_IdOrderByOrder_CreatedAtDesc(sellerId);
        return items.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SellerOrderResponse> getSellerOrdersPaged(Long sellerId, Pageable pageable) {
        Page<OrderItem> items = orderItemRepository.findByProduct_Seller_IdOrderByOrder_CreatedAtDesc(sellerId, pageable);
        return items.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void approveOrder(Long sellerId, Long orderItemId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        if (!item.getProduct().getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Seller does not own this item");
        }

        CustomerOrder parentOrder = item.getOrder();

        if (parentOrder.getStatus() != OrderStatus.PENDING_PAYMENT && parentOrder.getStatus() != OrderStatus.PAID && parentOrder.getStatus() != OrderStatus.DEPOSITED) {
            throw new RuntimeException("Order is not ready for processing");
        }

        parentOrder.setStatus(OrderStatus.SHIPPED);
        customerOrderRepository.save(parentOrder);
    }

    private SellerOrderResponse mapToResponse(OrderItem item) {
        SellerOrderResponse resp = new SellerOrderResponse();
        resp.setOrderItemId(item.getId());
        resp.setOrderId(item.getOrder().getId());
        
        String customerName = "Unknown";
        if (item.getOrder().getUser() != null && item.getOrder().getUser().getProfile() != null) {
            customerName = item.getOrder().getUser().getProfile().getFullName();
        }
        resp.setCustomerName(customerName);
        
        resp.setProductId(item.getProduct().getId());
        resp.setProductName(item.getProduct().getTitle());

        if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
            resp.setProductImageUrl(item.getProduct().getImages().iterator().next());
        }

        resp.setItemType(item.getItemType() != null ? item.getItemType().name() : null);

        BigDecimal price = item.getPriceAtPurchase();
        if (item.getItemType() != null && item.getItemType().name().equals("RENT") && item.getRentalDays() != null) {
            price = price.multiply(BigDecimal.valueOf(item.getRentalDays()));
        }
        resp.setPrice(price);

        resp.setOrderDate(item.getOrder().getCreatedAt());
        resp.setStatus(item.getOrder().getStatus());

        return resp;
    }
}
