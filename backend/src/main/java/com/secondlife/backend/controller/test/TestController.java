package com.secondlife.backend.controller.test;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.enums.UserRole;
import com.secondlife.backend.security.annotation.RequireRole;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<BaseResponse<String>> publicEndpoint() {
        return ResponseEntity.ok(BaseResponse.success("Đây là endpoint public"));
    }

    @GetMapping("/user")
    public ResponseEntity<BaseResponse<String>> userEndpoint() {
        return ResponseEntity.ok(BaseResponse.success("Đây là endpoint dành cho người dùng đã đăng nhập"));
    }

    @GetMapping("/admin")
    @RequireRole({UserRole.ADMIN})
    public ResponseEntity<BaseResponse<String>> adminEndpoint() {
        return ResponseEntity.ok(BaseResponse.success("Đây là endpoint dành cho admin"));
    }

    @GetMapping("/admin-or-user")
    @RequireRole({UserRole.ADMIN, UserRole.USER})
    public ResponseEntity<BaseResponse<String>> adminOrUserEndpoint() {
        return ResponseEntity.ok(BaseResponse.success("Đây là endpoint cho admin hoặc user"));
    }
}
