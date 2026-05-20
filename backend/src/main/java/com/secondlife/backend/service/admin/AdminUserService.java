package com.secondlife.backend.service.admin;

import com.secondlife.backend.domain.dto.admin.UserAdminResponse;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.domain.model.UserProfile;
import com.secondlife.backend.repository.UserAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUserService {
    private final UserAccountRepository userAccountRepository;

    public AdminUserService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional(readOnly = true)
    public Page<UserAdminResponse> getAllUsers(Pageable pageable) {
        Page<UserAccount> users = userAccountRepository.findAll(pageable);
        return users.map(user -> {
            UserProfile profile = user.getProfile();
            return UserAdminResponse.builder()
                    .id(user.getId())
                    .email(profile != null ? profile.getEmail() : "")
                    .name(profile != null ? profile.getFullName() : "Khách")
                    .avatar(profile != null ? profile.getAvatarUrl() : "")
                    .role(user.getRole())
                    .status(Boolean.TRUE.equals(user.getIsActive()) ? "active" : "banned")
                    .joinedAt(profile != null && profile.getJoinDate() != null ? profile.getJoinDate().toString() : "")
                    .totalOrders(user.getOrders() != null ? user.getOrders().size() : 0)
                    .build();
        });
    }

    @Transactional
    public void toggleUserStatus(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        userAccountRepository.save(user);
    }
}
