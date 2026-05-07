package com.secondlife.backend.service.auth;

import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.domain.model.UserProfile;
import com.secondlife.backend.domain.enums.UserRole;
import com.secondlife.backend.common.exception.BadRequestException;
import com.secondlife.backend.common.exception.UnauthorizedException;
import com.secondlife.backend.domain.dto.auth.AuthResponse;
import com.secondlife.backend.domain.dto.auth.LoginRequest;
import com.secondlife.backend.domain.dto.auth.RegisterRequest;
import com.secondlife.backend.domain.dto.auth.RefreshRequest;
import com.secondlife.backend.domain.model.RefreshToken;
import com.secondlife.backend.repository.UserAccountRepository;
import com.secondlife.backend.security.jwt.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class AuthService {
    private final UserAccountRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserAccountRepository userRepository, JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
    }

    public AuthResponse login(LoginRequest request) {
        log.info("User login with email: {}", request.getEmail());

        Optional<UserAccount> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            log.warn("User not found with email: {}", request.getEmail());
            throw new UnauthorizedException("Email hoặc mật khẩu không chính xác");
        }

        UserAccount user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password for user: {}", request.getEmail());
            throw new UnauthorizedException("Email hoặc mật khẩu không chính xác");
        }

        if (!user.getIsActive()) {
            log.warn("User account is inactive: {}", request.getEmail());
            throw new BadRequestException("Tài khoản của bạn đã bị khóa");
        }

        String token = tokenProvider.generateToken(user.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        log.info("User login successful: {}", request.getEmail());

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getProfile().getEmail())
                .fullName(user.getProfile().getFullName())
                .role(user.getRole())
                .token(token)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("User registration with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Email already exists: {}", request.getEmail());
            throw new BadRequestException("Email đã được đăng ký");
        }

        UserAccount user = new UserAccount();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setIsActive(true);

        user = userRepository.save(user);
        log.info("UserAccount created for: {}", request.getEmail());

        // Create UserProfile
        UserProfile profile = new UserProfile();
        profile.setUserId(user.getId());
        profile.setUser(user);
        profile.setEmail(request.getEmail());
        profile.setFullName(request.getFullName());
        profile.setJoinDate(LocalDate.now());
        profile.setRating(java.math.BigDecimal.ZERO);

        user.setProfile(profile);
        user = userRepository.save(user);
        log.info("User registered successfully: {}", request.getEmail());

        String token = tokenProvider.generateToken(user.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return AuthResponse.builder()
                .id(user.getId())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(user.getRole())
                .token(token)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    // Update refresh token -> rotation
                    refreshTokenService.deleteByToken(request.getRefreshToken());
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    String token = tokenProvider.generateToken(user.getId());
                    
                    return AuthResponse.builder()
                            .id(user.getId())
                            .email(user.getProfile().getEmail())
                            .fullName(user.getProfile().getFullName())
                            .role(user.getRole())
                            .token(token)
                            .refreshToken(newRefreshToken.getToken())
                            .build();
                })
                .orElseThrow(() -> new UnauthorizedException("Refresh token is not in database!"));
    }
}
