package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @deprecated Use {@link UserAccountRepository} instead
 * This is an alias maintained for backward compatibility
 */
@Repository
@Deprecated(forRemoval = true)
public interface UserRepository extends JpaRepository<UserAccount, Long> {
}

