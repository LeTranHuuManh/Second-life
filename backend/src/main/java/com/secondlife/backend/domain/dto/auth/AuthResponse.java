package com.secondlife.backend.domain.dto.auth;

import com.secondlife.backend.domain.enums.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String email;
    private String fullName;
    private UserRole role;
    private String token;
    private String refreshToken;
}
