package com.secondlife.backend.controller;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.seller.ShopProfileResponse;
import com.secondlife.backend.service.seller.SellerProfileService;
import com.secondlife.backend.domain.dto.seller.ShopProfileUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final SellerProfileService sellerProfileService;

    public ShopController(SellerProfileService sellerProfileService) {
        this.sellerProfileService = sellerProfileService;
    }

    @GetMapping("/{sellerId}")
    public ResponseEntity<BaseResponse<ShopProfileResponse>> getShopProfile(
            @PathVariable("sellerId") Long sellerId
    ) {
        try {
            ShopProfileResponse response = sellerProfileService.getShopProfile(sellerId);
            return ResponseEntity.ok(BaseResponse.success("Lấy thông tin shop thành công", response));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BaseResponse.notFound(ex.getMessage()));
        }
    }

    @PutMapping(value = "/{sellerId}", consumes = {"multipart/form-data"})
    public ResponseEntity<BaseResponse<ShopProfileResponse>> updateShopProfile(
            @PathVariable("sellerId") Long sellerId,
            @ModelAttribute ShopProfileUpdateRequest request,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        try {
            ShopProfileResponse response = sellerProfileService.updateProfile(sellerId, request, avatar, coverImage);
            return ResponseEntity.ok(BaseResponse.success("Cập nhật thông tin shop thành công", response));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BaseResponse.notFound(ex.getMessage()));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi khi tải lên file ảnh"));
        }
    }
}
