package com.secondlife.backend.domain.dto.admin;

import com.secondlife.backend.domain.enums.UserRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserAdminResponse {
    private Long id;
    private String email;
    private String name;
    private String avatar;
    private UserRole role;
    private String status;
    private String joinedAt;
    private int totalOrders;
}
