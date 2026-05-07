package com.secondlife.backend.controller.user;

import com.secondlife.backend.common.response.BaseResponse;
import com.secondlife.backend.domain.dto.admin.UserAdminResponse;
import com.secondlife.backend.service.admin.AdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<Page<UserAdminResponse>>> getAllUsers(Pageable pageable) {
        Page<UserAdminResponse> page = adminUserService.getAllUsers(pageable);
        return ResponseEntity.ok(BaseResponse.success("Lấy danh sách người dùng thành công", page));
    }
}
