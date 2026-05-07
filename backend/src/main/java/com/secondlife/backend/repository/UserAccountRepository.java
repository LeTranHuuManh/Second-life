package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    @Query("SELECT u FROM UserAccount u JOIN u.profile p WHERE p.email = :email")
    Optional<UserAccount> findByEmail(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UserAccount u JOIN u.profile p WHERE p.email = :email")
    boolean existsByEmail(@Param("email") String email);
}
