package com.secondlife.backend.controller;

import com.secondlife.backend.domain.dto.product.ProductCreateRequest;
import com.secondlife.backend.domain.dto.product.ProductDetailResponse;
import com.secondlife.backend.domain.dto.product.ProductResponse;
import com.secondlife.backend.service.CloudinaryService;
import com.secondlife.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
}
