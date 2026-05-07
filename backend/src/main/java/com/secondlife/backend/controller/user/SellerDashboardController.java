package com.secondlife.backend.controller.user;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.seller.DashboardStatsResponse;
import com.secondlife.backend.security.jwt.JwtTokenProvider;
import com.secondlife.backend.service.seller.SellerDashboardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SellerDashboardController {

    private final SellerDashboardService dashboardService;
    private final JwtTokenProvider tokenProvider;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return null;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<DashboardStatsResponse>> getStats(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userId);
        return ResponseEntity.ok(BaseResponse.success("Lấy thống kê thành công", stats));
    }
}
