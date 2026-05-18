package com.secondlife.backend.service;

import com.secondlife.backend.domain.dto.product.ProductCreateRequest;
import com.secondlife.backend.domain.dto.product.ProductUpdateRequest;
import com.secondlife.backend.domain.dto.product.ProductDetailResponse;
import com.secondlife.backend.domain.dto.product.ProductResponse;
import com.secondlife.backend.domain.dto.product.SellerInfo;
import com.secondlife.backend.domain.enums.ListingType;
import com.secondlife.backend.domain.enums.ProductStatus;
import com.secondlife.backend.domain.model.Category;
import com.secondlife.backend.domain.model.Product;
import com.secondlife.backend.domain.model.SellerProfile;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.domain.model.UserProfile;
import com.secondlife.backend.repository.CategoryRepository;
import com.secondlife.backend.repository.CustomerOrderRepository;
import com.secondlife.backend.repository.ProductRepository;
import com.secondlife.backend.repository.UserAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserAccountRepository userAccountRepository;
    private final CustomerOrderRepository customerOrderRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          UserAccountRepository userAccountRepository,
                          CustomerOrderRepository customerOrderRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userAccountRepository = userAccountRepository;
        this.customerOrderRepository = customerOrderRepository;
    }

    public ProductResponse createProduct(ProductCreateRequest request, Long sellerId) {
        UserAccount seller = userAccountRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng (Seller)"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục (Category)"));

        ListingType listingType = null;
        try {
            listingType = ListingType.valueOf(request.getListingType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Loại hình đăng không hợp lệ (Phải là SELL, RENT, hoặc SELL_AND_RENT)");
        }

        // Logic check điều kiện thông tin dựa vào loại hình
        if (listingType == ListingType.SELL || listingType == ListingType.SELL_AND_RENT) {
            if (request.getPrice() == null || request.getPrice().doubleValue() <= 0) {
                throw new RuntimeException("Hình thức Bán yêu cầu phải nhập giá bán lớn hơn 0");
            }
        }
        if (listingType == ListingType.RENT || listingType == ListingType.SELL_AND_RENT) {
            if (request.getRentalPricePerDay() == null || request.getRentalPricePerDay().doubleValue() <= 0) {
                throw new RuntimeException("Hình thức Thuê yêu cầu phải nhập giá thuê/ngày lớn hơn 0");
            }
        }

        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        
        // Gán 0 nếu user vô tình bỏ trống nhưng không nằm trong loại hình require
        product.setPrice(request.getPrice() != null ? request.getPrice() : java.math.BigDecimal.ZERO);
        product.setRentalPricePerDay(request.getRentalPricePerDay() != null ? request.getRentalPricePerDay() : java.math.BigDecimal.ZERO);
        
        product.setCondition(request.getCondition());
        product.setLocation(request.getLocation());
        product.setListingType(listingType);
        product.setStatus(ProductStatus.AVAILABLE);

        product.setSeller(seller);
        product.setCategory(category);
        
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            product.getImages().addAll(request.getImages());
        }

        Product savedProduct = productRepository.save(product);

        return ProductResponse.builder()
                .id(savedProduct.getId())
                .title(savedProduct.getTitle())
                .description(savedProduct.getDescription())
                .price(savedProduct.getPrice())
                .rentalPricePerDay(savedProduct.getRentalPricePerDay())
                .condition(savedProduct.getCondition())
                .location(savedProduct.getLocation())
                .listingType(savedProduct.getListingType().name())
                .status(savedProduct.getStatus().name())
                .categoryId(category.getId())
                .sellerId(seller.getId())
                .images(savedProduct.getImages())
                .build();
    }

    @Transactional
    public ProductResponse addImagesToProduct(Long productId, List<String> imageUrls) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        product.getImages().addAll(imageUrls);
        Product savedProduct = productRepository.save(product);

        return ProductResponse.builder()
                .id(savedProduct.getId())
                .title(savedProduct.getTitle())
                .description(savedProduct.getDescription())
                .price(savedProduct.getPrice())
                .rentalPricePerDay(savedProduct.getRentalPricePerDay())
                .condition(savedProduct.getCondition())
                .location(savedProduct.getLocation())
                .listingType(savedProduct.getListingType().name())
                .status(savedProduct.getStatus().name())
                .categoryId(savedProduct.getCategory().getId())
                .sellerId(savedProduct.getSeller().getId())
                .images(savedProduct.getImages())
                .build();
    }

    /**
     * Lấy chi tiết sản phẩm theo ID
     */
    @Transactional(readOnly = true)
    public ProductDetailResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));
        return convertToDetailResponse(product);
    }

    /**
     * Lấy danh sách sản phẩm cho trang chủ (public, phân trang)
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAvailableProducts(Pageable pageable) {
        return productRepository.findByStatusOrderByCreatedAtDesc(ProductStatus.AVAILABLE, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Lấy danh sách sản phẩm của người dùng (quản lý bán hàng, phân trang)
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getUserProducts(Long userId, Pageable pageable) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        return productRepository.findBySellerOrderByCreatedAtDesc(user, pageable)
                .map(this::convertToResponse);
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest request, Long sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        if (product.getSeller() == null || !product.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật sản phẩm này");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục (Category)"));

        ListingType listingType;
        try {
            listingType = ListingType.valueOf(request.getListingType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Loại hình đăng không hợp lệ (Phải là SELL, RENT, hoặc SELL_AND_RENT)");
        }

        if (listingType == ListingType.SELL || listingType == ListingType.SELL_AND_RENT) {
            if (request.getPrice() == null || request.getPrice().doubleValue() <= 0) {
                throw new RuntimeException("Hình thức Bán yêu cầu phải nhập giá bán lớn hơn 0");
            }
        }
        if (listingType == ListingType.RENT || listingType == ListingType.SELL_AND_RENT) {
            if (request.getRentalPricePerDay() == null || request.getRentalPricePerDay().doubleValue() <= 0) {
                throw new RuntimeException("Hình thức Thuê yêu cầu phải nhập giá thuê/ngày lớn hơn 0");
            }
        }

        BigDecimal price = request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO;
        BigDecimal rentalPrice = request.getRentalPricePerDay() != null ? request.getRentalPricePerDay() : BigDecimal.ZERO;

        if (listingType == ListingType.SELL) {
            rentalPrice = BigDecimal.ZERO;
        }
        if (listingType == ListingType.RENT) {
            price = BigDecimal.ZERO;
        }

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(price);
        product.setRentalPricePerDay(rentalPrice);
        product.setCondition(request.getCondition());
        product.setLocation(request.getLocation());
        product.setListingType(listingType);
        product.setCategory(category);
        if (request.getImages() != null) {
            product.getImages().clear();
            product.getImages().addAll(request.getImages());
        }

        Product savedProduct = productRepository.save(product);
        return convertToResponse(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long productId, Long sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        if (product.getSeller() == null || !product.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Bạn không có quyền xoá sản phẩm này");
        }

        if (product.getOrderItems() != null && !product.getOrderItems().isEmpty()) {
            throw new RuntimeException("Không thể xoá sản phẩm đã có đơn hàng");
        }

        productRepository.delete(product);
    }

        /**
         * Tìm kiếm sản phẩm theo bộ lọc và phân trang
         */
        @Transactional(readOnly = true)
        public Page<ProductResponse> searchProducts(
            String query,
            Long categoryId,
            String listingType,
                String province,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
        ) {
        Specification<Product> spec = buildSearchSpecification(
            query,
            categoryId,
            listingType,
                province,
            minPrice,
            maxPrice
        );

        return productRepository.findAll(spec, pageable)
            .map(this::convertToResponse);
        }

    /**
     * Convert Product entity sang ProductResponse DTO
     */
    private ProductResponse convertToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .rentalPricePerDay(product.getRentalPricePerDay())
                .condition(product.getCondition())
                .location(product.getLocation())
                .listingType(product.getListingType() != null ? product.getListingType().name() : null)
                .status(product.getStatus().name())
                .categoryId(product.getCategory().getId())
                .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
                .images(product.getImages())
                .build();
    }

    private ProductDetailResponse convertToDetailResponse(Product product) {
        return ProductDetailResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .rentalPricePerDay(product.getRentalPricePerDay())
                .condition(product.getCondition())
                .location(product.getLocation())
                .listingType(product.getListingType() != null ? product.getListingType().name() : null)
                .status(product.getStatus().name())
                .categoryId(product.getCategory().getId())
                .seller(buildSellerInfo(product.getSeller()))
                .images(product.getImages())
                .build();
    }

    private SellerInfo buildSellerInfo(UserAccount seller) {
        SellerProfile sellerProfile = seller.getSellerProfile();
        UserProfile userProfile = seller.getProfile();

        String name = null;
        String avatarUrl = null;
        String address = null;
        String joinedAt = null;
        Long totalOrders = 0L;
        java.math.BigDecimal rating = java.math.BigDecimal.ZERO;

        if (sellerProfile != null) {
            name = sellerProfile.getShopName();
            avatarUrl = sellerProfile.getAvatarUrl();
            address = sellerProfile.getAddress();
            if (sellerProfile.getJoinedDate() != null) {
                joinedAt = sellerProfile.getJoinedDate().toString();
            }
            if (sellerProfile.getRating() != null) {
                rating = sellerProfile.getRating();
            }
        }

        if (name == null || name.isBlank()) {
            name = userProfile != null ? userProfile.getFullName() : null;
        }

        if (avatarUrl == null || avatarUrl.isBlank()) {
            avatarUrl = userProfile != null ? userProfile.getAvatarUrl() : null;
        }

        if (address == null || address.isBlank()) {
            address = userProfile != null ? userProfile.getAddress() : null;
        }

        if (joinedAt == null || joinedAt.isBlank()) {
            joinedAt = userProfile != null && userProfile.getJoinDate() != null
                    ? userProfile.getJoinDate().toString()
                    : null;
        }

        if (name == null || name.isBlank()) {
            name = "Unknown";
        }

        if (seller.getId() != null) {
            totalOrders = customerOrderRepository.countOrdersBySellerId(seller.getId());
        }

        return SellerInfo.builder()
                .id(seller.getId())
                .fullName(name)
                .avatarUrl(avatarUrl)
            .address(address)
            .joinedAt(joinedAt)
            .totalOrders(totalOrders)
            .rating(rating)
                .build();
    }

    private Specification<Product> buildSearchSpecification(
            String query,
            Long categoryId,
            String listingType,
            String province,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.AVAILABLE));

            if (query != null && !query.isBlank()) {
                String likeQuery = "%" + query.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        likeQuery
                ));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (province != null && !province.isBlank()) {
                String likeProvince = "%" + province.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("location")),
                        likeProvince
                ));
            }

            List<ListingType> types = resolveListingTypes(listingType);
            if (!types.isEmpty()) {
                predicates.add(root.get("listingType").in(types));
            }

            if (minPrice != null || maxPrice != null) {
                Predicate pricePredicate = buildPricePredicate(
                        criteriaBuilder,
                        root,
                        listingType,
                        minPrice,
                        maxPrice
                );
                if (pricePredicate != null) {
                    predicates.add(pricePredicate);
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private List<ListingType> resolveListingTypes(String listingType) {
        List<ListingType> types = new ArrayList<>();
        if (listingType == null || listingType.isBlank() || "all".equalsIgnoreCase(listingType)) {
            return types;
        }

        String normalized = listingType.trim().toUpperCase();
        if ("BUY".equals(normalized) || "SELL".equals(normalized)) {
            types.add(ListingType.SELL);
            types.add(ListingType.SELL_AND_RENT);
        } else if ("RENT".equals(normalized)) {
            types.add(ListingType.RENT);
            types.add(ListingType.SELL_AND_RENT);
        } else if ("BOTH".equals(normalized) || "SELL_AND_RENT".equals(normalized)) {
            types.add(ListingType.SELL_AND_RENT);
        }

        return types;
    }

    private Predicate buildPricePredicate(
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder,
            jakarta.persistence.criteria.Root<Product> root,
            String listingType,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        String normalized = listingType == null ? "" : listingType.trim().toUpperCase();
        boolean isBuy = "BUY".equals(normalized) || "SELL".equals(normalized);
        boolean isRent = "RENT".equals(normalized);
        boolean isBoth = "BOTH".equals(normalized) || "SELL_AND_RENT".equals(normalized) || normalized.isBlank();

        Predicate sellPredicate = buildRangePredicate(
                criteriaBuilder,
                root.get("price"),
                minPrice,
                maxPrice
        );
        Predicate rentPredicate = buildRangePredicate(
                criteriaBuilder,
                root.get("rentalPricePerDay"),
                minPrice,
                maxPrice
        );

        if (isBuy) {
            return sellPredicate;
        }

        if (isRent) {
            return rentPredicate;
        }

        if (isBoth) {
            if (sellPredicate != null && rentPredicate != null) {
                return criteriaBuilder.or(sellPredicate, rentPredicate);
            }
            return sellPredicate != null ? sellPredicate : rentPredicate;
        }

        return null;
    }

    private Predicate buildRangePredicate(
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder,
            jakarta.persistence.criteria.Path<BigDecimal> field,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        if (minPrice != null && maxPrice != null) {
            return criteriaBuilder.between(field, minPrice, maxPrice);
        }
        if (minPrice != null) {
            return criteriaBuilder.greaterThanOrEqualTo(field, minPrice);
        }
        if (maxPrice != null) {
            return criteriaBuilder.lessThanOrEqualTo(field, maxPrice);
        }
        return null;
    }
}
