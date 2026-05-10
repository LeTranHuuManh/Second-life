package com.secondlife.backend.service.impl;

import com.secondlife.backend.domain.enums.OrderItemType;
import com.secondlife.backend.domain.enums.OrderStatus;
import com.secondlife.backend.domain.enums.ListingType;
import com.secondlife.backend.domain.model.CustomerOrder;
import com.secondlife.backend.domain.model.OrderItem;
import com.secondlife.backend.domain.model.Product;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.domain.model.UserAddress;
import com.secondlife.backend.dto.address.AddressResponse;
import com.secondlife.backend.dto.order.OrderCreateRequest;
import com.secondlife.backend.dto.order.OrderItemRequest;
import com.secondlife.backend.dto.order.OrderItemResponse;
import com.secondlife.backend.dto.order.OrderResponse;
import com.secondlife.backend.repository.CustomerOrderRepository;
import com.secondlife.backend.repository.OrderItemRepository;
import com.secondlife.backend.repository.ProductRepository;
import com.secondlife.backend.repository.UserAddressRepository;
import com.secondlife.backend.repository.UserRepository;
import com.secondlife.backend.service.CustomerOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerOrderServiceImpl implements CustomerOrderService {

    private final CustomerOrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final ProductRepository productRepository;

    public CustomerOrderServiceImpl(
            CustomerOrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            UserAddressRepository addressRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public List<OrderResponse> createOrder(Long userId, OrderCreateRequest request) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Address does not belong to the user");
        }

        List<Long> productIds = request.getItems().stream()
                .map(OrderItemRequest::getProductId)
                .collect(Collectors.toList());
                
        java.util.Map<Long, Product> productMap = productRepository.findAllById(productIds)
                .stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        // Group items by Seller ID
        java.util.Map<Long, List<OrderItemRequest>> itemsGroupedBySeller = request.getItems().stream()
                .collect(Collectors.groupingBy(itemReq -> {
                    Product product = productMap.get(itemReq.getProductId());
                    if (product == null) {
                        throw new RuntimeException("Product not found: " + itemReq.getProductId());
                    }
                    return product.getSeller().getId();
                }));

        List<OrderResponse> responseList = new java.util.ArrayList<>();

        for (java.util.Map.Entry<Long, List<OrderItemRequest>> entry : itemsGroupedBySeller.entrySet()) {
            List<OrderItemRequest> sellerItems = entry.getValue();

            CustomerOrder order = new CustomerOrder();
            order.setUser(user);
            order.setShippingAddress(address);
            order.setNote(request.getNote());
            order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "PayOS");
            order.setStatus(OrderStatus.PENDING_PAYMENT);

            // Calculate fees per seller order
            BigDecimal shippingFee = BigDecimal.valueOf(30000); // 30k default shipping fee for testing
            order.setShippingFee(shippingFee);

            BigDecimal totalAmount = shippingFee;
            BigDecimal depositAmount = BigDecimal.ZERO;

            for (OrderItemRequest itemReq : sellerItems) {
                Product product = productMap.get(itemReq.getProductId());

                validateProductAvailability(product);
                OrderItemType reqType = itemReq.getType();

                BigDecimal itemTotal = BigDecimal.ZERO;
                BigDecimal itemDeposit = BigDecimal.ZERO;
                BigDecimal priceAtPurchase = BigDecimal.ZERO;

                if (reqType == OrderItemType.RENT) {
                    validateRentItem(product, itemReq);
                    priceAtPurchase = product.getRentalPricePerDay() != null ? product.getRentalPricePerDay() : BigDecimal.ZERO;
                    itemTotal = priceAtPurchase.multiply(BigDecimal.valueOf(itemReq.getRentalDays()));
                    itemDeposit = calculateRentDeposit(product);
                } else if (reqType == OrderItemType.BUY) {
                    validateBuyItem(product);
                    priceAtPurchase = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
                    itemTotal = priceAtPurchase;
                    itemDeposit = BigDecimal.ZERO; // No deposit for buying
                }

                totalAmount = totalAmount.add(itemTotal);
                depositAmount = depositAmount.add(itemDeposit);

                OrderItem orderItem = buildOrderItem(order, product, reqType, itemReq, priceAtPurchase);
                order.getItems().add(orderItem);
            }

            order.setTotalAmount(totalAmount);
            order.setDepositAmount(depositAmount);
            
            CustomerOrder savedOrder = orderRepository.save(order);
            responseList.add(mapToResponse(savedOrder));
        }

        return responseList;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateProductAvailability(Product product) {
        if (!"AVAILABLE".equals(product.getStatus().name())) {
            throw new RuntimeException("Product is not available: " + product.getTitle());
        }
    }

    private void validateRentItem(Product product, OrderItemRequest itemReq) {
        if (product.getListingType() == ListingType.SELL) {
            throw new RuntimeException("Product is for sale only, not for rent: " + product.getTitle());
        }
        if (itemReq.getRentalDays() == null || itemReq.getRentalDays() < 1) {
            throw new RuntimeException("Rental days must be provided and >= 1 for renting");
        }
        if (itemReq.getStartDate() == null || itemReq.getEndDate() == null) {
            throw new RuntimeException("Start date and end date must be provided for renting");
        }
    }

    private void validateBuyItem(Product product) {
        if (product.getListingType() == ListingType.RENT) {
            throw new RuntimeException("Product is for rent only, not for sale: " + product.getTitle());
        }
    }

    private BigDecimal calculateRentDeposit(Product product) {
        if (product.getPrice() != null) {
            return product.getPrice().multiply(BigDecimal.valueOf(0.5)); // 50% deposit
        }
        return BigDecimal.ZERO;
    }

    private OrderItem buildOrderItem(CustomerOrder savedOrder, Product product, OrderItemType reqType, OrderItemRequest itemReq, BigDecimal priceAtPurchase) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(savedOrder);
        orderItem.setProduct(product);
        orderItem.setItemType(reqType);
        orderItem.setPriceAtPurchase(priceAtPurchase);
        
        if (reqType == OrderItemType.RENT) {
            orderItem.setRentalDays(itemReq.getRentalDays());
            orderItem.setStartDate(itemReq.getStartDate());
            orderItem.setEndDate(itemReq.getEndDate());
        }
        
        return orderItem;
    }

    private OrderResponse mapToResponse(CustomerOrder order) {
        OrderResponse rs = new OrderResponse();
        rs.setId(order.getId());
        rs.setShippingFee(order.getShippingFee());
        rs.setNote(order.getNote());
        rs.setTotalAmount(order.getTotalAmount());
        rs.setDepositAmount(order.getDepositAmount());
        rs.setStatus(order.getStatus());
        rs.setPaymentMethod(order.getPaymentMethod());
        rs.setPaymentAt(order.getPaymentAt());
        rs.setCreatedAt(order.getCreatedAt());

        if (order.getShippingAddress() != null) {
            UserAddress addr = order.getShippingAddress();
            rs.setShippingAddress(AddressResponse.builder()
                    .id(addr.getId())
                    .name(addr.getName())
                    .phoneNumber(addr.getPhoneNumber())
                    .address(addr.getAddress())
                    .isDefault(addr.getIsDefault())
                    .build());
        }

        if (order.getItems() != null) {
            List<OrderItemResponse> items = order.getItems().stream().map(item -> {
                OrderItemResponse itemRs = new OrderItemResponse();
                itemRs.setId(item.getId());
                itemRs.setProductId(item.getProduct().getId());
                itemRs.setProductName(item.getProduct().getTitle());
                itemRs.setType(item.getItemType() != null ? item.getItemType().name() : null);
                
                // Assuming there might be a getImages() trick, we leave null or empty for now
                if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                     itemRs.setProductImageUrl(item.getProduct().getImages().iterator().next());
                }
                
                itemRs.setPriceAtPurchase(item.getPriceAtPurchase());
                itemRs.setRentalDays(item.getRentalDays());
                itemRs.setStartDate(item.getStartDate());
                itemRs.setEndDate(item.getEndDate());
                return itemRs;
            }).collect(Collectors.toList());
            rs.setItems(items);
        }

        return rs;
    }
}
