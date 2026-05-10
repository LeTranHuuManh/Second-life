package com.secondlife.backend.repository;

import com.secondlife.backend.domain.enums.RegistrationStatus;
import com.secondlife.backend.domain.model.SellerRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRegistrationRepository extends JpaRepository<SellerRegistration, Long> {
    boolean existsByUserIdAndStatus(Long userId, RegistrationStatus status);
    
    Optional<SellerRegistration> findTopByUserIdOrderByCreatedAtDesc(Long userId);

    Page<SellerRegistration> findByStatus(RegistrationStatus status, Pageable pageable);
}
