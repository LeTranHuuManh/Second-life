package com.secondlife.backend.controller;

import com.secondlife.backend.domain.dto.product.ProductCreateRequest;
import com.secondlife.backend.domain.dto.product.ProductDetailResponse;
import com.secondlife.backend.domain.dto.product.ProductResponse;
import com.secondlife.backend.domain.dto.product.ProductUpdateRequest;
import com.secondlife.backend.service.CloudinaryService;
import com.secondlife.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    public ProductController(ProductService productService, CloudinaryService cloudinaryService) {
        this.productService = productService;
        this.cloudinaryService = cloudinaryService;
    }

    /**
     * API Tạo mới đăng một sản phẩm
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProductResponse response = productService.createProduct(request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * API Upload một hoặc nhiều ảnh cho sản phẩm.
     * Ảnh sẽ được lưu vào thư mục trên Cloudinary với format: "products/{productId}"
     */
    @PostMapping("/{productId}/images")
    public ResponseEntity<?> uploadProductImages(
            @PathVariable("productId") Long productId,
            @RequestParam("files") MultipartFile[] files
    ) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body("Vui lòng chọn ít nhất một file ảnh.");
        }

        String folderName = "products/" + productId;
        List<String> uploadedUrls = new ArrayList<>();
        List<Map<String, Object>> uploadDetails = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                // Upload từng file lên Cloudinary
                Map<String, Object> result = cloudinaryService.uploadFile(file, folderName);
                uploadedUrls.add(result.get("secure_url").toString());
                uploadDetails.add(result);
            }

            // Gọi ProductService để lưu thông tin URL ảnh vào Database
            ProductResponse updatedProduct = productService.addImagesToProduct(productId, uploadedUrls);

            return ResponseEntity.ok(Map.of(
                    "message", "Upload ảnh sản phẩm thành công!",
                    "urls", uploadedUrls,
                    "product", updatedProduct,
                    "details", uploadDetails
            ));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi upload ảnh lên Cloudinary: " + e.getMessage());
        }
    }

    /**
     * API Lấy thông tin chi tiết một sản phẩm theo ID
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailResponse> getProductById(@PathVariable("productId") Long productId) {
        ProductDetailResponse product = productService.getProductById(productId);
        return ResponseEntity.ok(product);
    }

    /**
     * API Lấy danh sách sản phẩm cho trang chủ (public, phân trang)
     * Query params: page (mặc định 0), size (mặc định 20)
     */
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAvailableProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getAvailableProducts(pageable);
        return ResponseEntity.ok(products);
    }

        /**
         * API Tìm kiếm sản phẩm (public, phân trang)
         * Query params: q, categoryId, listingType, minPrice, maxPrice, sort, page, size
         */
        @GetMapping("/search")
        public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "listingType", required = false) String listingType,
                @RequestParam(value = "province", required = false) String province,
            @RequestParam(value = "minPrice", required = false) java.math.BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) java.math.BigDecimal maxPrice,
            @RequestParam(value = "sort", defaultValue = "default") String sort,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
        ) {
        Sort sortSpec = buildSort(sort, listingType);
        Pageable pageable = PageRequest.of(page, size, sortSpec);
        Page<ProductResponse> products = productService.searchProducts(
            query,
            categoryId,
            listingType,
                province,
            minPrice,
            maxPrice,
            pageable
        );
        return ResponseEntity.ok(products);
        }

    /**
     * API Lấy danh sách sản phẩm của người dùng (quản lý bán hàng, phân trang)
     * Query params: page (mặc định 0), size (mặc định 20)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ProductResponse>> getUserProducts(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> userProducts = productService.getUserProducts(userId, pageable);
        return ResponseEntity.ok(userProducts);
    }

    /**
     * API Cập nhật sản phẩm (Seller/Admin)
     */
    @PutMapping("/{productId}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable("productId") Long productId,
            @Valid @RequestBody ProductUpdateRequest request
    ) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProductResponse response = productService.updateProduct(productId, request, currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * API Xoa san pham (Seller/Admin)
     */
    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable("productId") Long productId) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        productService.deleteProduct(productId, currentUserId);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    private Sort buildSort(String sort, String listingType) {
        if (sort == null || sort.isBlank() || "default".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        if ("price_asc".equalsIgnoreCase(sort) || "price_desc".equalsIgnoreCase(sort)) {
            Sort.Direction direction = "price_asc".equalsIgnoreCase(sort)
                    ? Sort.Direction.ASC
                    : Sort.Direction.DESC;

            String property = resolvePriceSortField(listingType);
            return Sort.by(direction, property).and(Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        if ("distance".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.ASC, "location").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        return Sort.by(Sort.Direction.DESC, "createdAt");
    }

    private String resolvePriceSortField(String listingType) {
        if (listingType == null) {
            return "price";
        }

        String normalized = listingType.trim().toUpperCase();
        if ("RENT".equals(normalized)) {
            return "rentalPricePerDay";
        }

        return "price";
    }
}
