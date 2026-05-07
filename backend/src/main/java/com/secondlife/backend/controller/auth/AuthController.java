package com.secondlife.backend.controller.auth;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.auth.AuthResponse;
import com.secondlife.backend.domain.dto.auth.LoginRequest;
import com.secondlife.backend.domain.dto.auth.RegisterRequest;
import com.secondlife.backend.domain.dto.auth.RefreshRequest;
import com.secondlife.backend.domain.dto.auth.LogoutRequest;
import com.secondlife.backend.service.auth.AuthService;
import com.secondlife.backend.service.auth.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthService authService, RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/auth/login - Email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(BaseResponse.success("Đăng nhập thành công", response));
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success("Đăng ký thành công", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<BaseResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        log.info("POST /api/auth/refresh");
        AuthResponse response = authService.refresh(request);
        return ResponseEntity.ok(BaseResponse.success("Làm mới token thành công", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<BaseResponse<String>> logout(@Valid @RequestBody LogoutRequest request) {
        log.info("POST /api/auth/logout");
        refreshTokenService.deleteByToken(request.getRefreshToken());
        return ResponseEntity.ok(BaseResponse.success("Đăng xuất thành công", "Success"));
    }
}
