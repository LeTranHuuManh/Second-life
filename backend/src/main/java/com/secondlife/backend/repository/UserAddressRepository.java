package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByUserIdOrderByIsDefaultDescIdDesc(Long userId);
    
    // Tìm địa chỉ mặc định
    boolean existsByUserIdAndIsDefaultTrue(Long userId);
}
