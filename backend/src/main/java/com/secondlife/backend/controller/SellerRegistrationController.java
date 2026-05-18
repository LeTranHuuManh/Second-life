package com.secondlife.backend.controller;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.seller.ReviewRegistrationRequest;
import com.secondlife.backend.domain.dto.seller.SellerRegistrationRequest;
import com.secondlife.backend.domain.dto.seller.SellerRegistrationResponse;
import com.secondlife.backend.domain.enums.RegistrationStatus;
import com.secondlife.backend.service.seller.SellerRegistrationService;
import com.secondlife.backend.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/seller-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SellerRegistrationController {

    private final SellerRegistrationService sellerRegistrationService;
    private final JwtTokenProvider tokenProvider;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return null;
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BaseResponse<SellerRegistrationResponse>> register(
            @Valid @ModelAttribute SellerRegistrationRequest requestBody,
            @RequestParam("avatar") MultipartFile avatar,
            @RequestParam("coverImage") MultipartFile coverImage,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        SellerRegistrationResponse response = sellerRegistrationService.createRegistration(userId, requestBody, avatar, coverImage);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("Gửi yêu cầu đăng ký thành công", response));
    }

    @GetMapping("/my-status")
    @PreAuthorize("hasRole('USER') or hasRole('SELLER')")
    public ResponseEntity<BaseResponse<SellerRegistrationResponse>> getMyStatus(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        SellerRegistrationResponse response = sellerRegistrationService.getMyRegistration(userId);
        return ResponseEntity.ok(BaseResponse.success("Lấy trạng thái thành công", response));
    }

    // Role ADMIN endpoints
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<Page<SellerRegistrationResponse>>> getPendingRequests(Pageable pageable) {
        Page<SellerRegistrationResponse> page = sellerRegistrationService.getRegistrationsByStatus(RegistrationStatus.PENDING, pageable);
        return ResponseEntity.ok(BaseResponse.success("Danh sách đang chờ duyệt", page));
    }

    @PutMapping("/admin/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<SellerRegistrationResponse>> reviewRequest(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRegistrationRequest requestBody) {
        SellerRegistrationResponse response = sellerRegistrationService.reviewRegistration(id, requestBody);
        return ResponseEntity.ok(BaseResponse.success("Đã duyệt yêu cầu", response));
    }
}
