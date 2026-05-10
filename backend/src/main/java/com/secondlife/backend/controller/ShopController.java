package com.secondlife.backend.controller;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.seller.ShopProfileResponse;
import com.secondlife.backend.service.seller.SellerProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
