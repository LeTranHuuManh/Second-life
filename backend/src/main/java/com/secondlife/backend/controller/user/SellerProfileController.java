package com.secondlife.backend.controller.user;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.seller.ShopProfileResponse;
import com.secondlife.backend.service.seller.SellerProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/seller/profile")
public class SellerProfileController {

    private final SellerProfileService sellerProfileService;

    public SellerProfileController(SellerProfileService sellerProfileService) {
        this.sellerProfileService = sellerProfileService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<ShopProfileResponse>> updateProfile(
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        Long currentUserId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            ShopProfileResponse response = sellerProfileService.updateProfile(
                    currentUserId,
                    description,
                    avatar,
                    coverImage
            );
            return ResponseEntity.ok(BaseResponse.success("Cập nhật profile thành công", response));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BaseResponse.notFound(ex.getMessage()));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse.internalError("Upload ảnh thất bại"));
        }
    }
}
