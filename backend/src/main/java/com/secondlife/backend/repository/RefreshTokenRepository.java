package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.RefreshToken;
import com.secondlife.backend.domain.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    int deleteByUser(UserAccount user);
    
    @Modifying
    void deleteByToken(String token);
}
