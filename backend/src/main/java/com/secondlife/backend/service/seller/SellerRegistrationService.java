package com.secondlife.backend.service.seller;

import com.secondlife.backend.common.exception.BadRequestException;
import com.secondlife.backend.common.exception.AppException;
import com.secondlife.backend.domain.dto.seller.ReviewRegistrationRequest;
import com.secondlife.backend.domain.dto.seller.SellerRegistrationRequest;
import com.secondlife.backend.domain.dto.seller.SellerRegistrationResponse;
import com.secondlife.backend.domain.enums.RegistrationStatus;
import com.secondlife.backend.domain.enums.UserRole;
import com.secondlife.backend.domain.model.SellerRegistration;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.repository.SellerRegistrationRepository;
import com.secondlife.backend.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SellerRegistrationService {

    private final SellerRegistrationRepository sellerRegistrationRepository;
    private final UserAccountRepository userRepository;

    @Transactional
    public SellerRegistrationResponse createRegistration(Long userId, SellerRegistrationRequest request) {
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Người dùng không tồn tại"));

        if (user.getRole() == UserRole.SELLER || user.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("Bạn đã có quyền đăng bán rồi");
        }

        if (sellerRegistrationRepository.existsByUserIdAndStatus(userId, RegistrationStatus.PENDING)) {
            throw new BadRequestException("Bạn đang có một yêu cầu chờ duyệt");
        }

        SellerRegistration registration = SellerRegistration.builder()
                .user(user)
                .shopName(request.getShopName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .status(RegistrationStatus.PENDING)
                .build();

        registration = sellerRegistrationRepository.save(registration);

        return mapToResponse(registration);
    }

    @Transactional(readOnly = true)
    public SellerRegistrationResponse getMyRegistration(Long userId) {
        SellerRegistration registration = sellerRegistrationRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Không tìm thấy yêu cầu đăng ký nào"));
        return mapToResponse(registration);
    }

    @Transactional(readOnly = true)
    public Page<SellerRegistrationResponse> getRegistrationsByStatus(RegistrationStatus status, Pageable pageable) {
        return sellerRegistrationRepository.findByStatus(status, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public SellerRegistrationResponse reviewRegistration(Long id, ReviewRegistrationRequest request) {
        SellerRegistration registration = sellerRegistrationRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Không tìm thấy yêu cầu"));

        if (registration.getStatus() != RegistrationStatus.PENDING) {
            throw new BadRequestException("Yêu cầu này đã được xử lý");
        }

        registration.setStatus(request.getStatus());
        registration.setAdminNote(request.getAdminNote());

        if (request.getStatus() == RegistrationStatus.APPROVED) {
            UserAccount user = registration.getUser();
            user.setRole(UserRole.SELLER);
            userRepository.save(user);
        }

        registration = sellerRegistrationRepository.save(registration);
        return mapToResponse(registration);
    }

    private SellerRegistrationResponse mapToResponse(SellerRegistration registration) {
        return SellerRegistrationResponse.builder()
                .id(registration.getId())
                .userId(registration.getUser().getId())
                .userEmail(registration.getUser().getProfile().getEmail())
                .userFullName(registration.getUser().getProfile().getFullName())
                .shopName(registration.getShopName())
                .phone(registration.getPhone())
                .address(registration.getAddress())
                .status(registration.getStatus())
                .adminNote(registration.getAdminNote())
                .createdAt(registration.getCreatedAt())
                .updatedAt(registration.getUpdatedAt())
                .build();
    }
}
