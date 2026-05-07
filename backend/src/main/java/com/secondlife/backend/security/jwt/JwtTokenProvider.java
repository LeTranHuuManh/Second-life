package com.secondlife.backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret:your-secret-key-at-least-256-bits-long-for-hs256-algorithm}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationInMs;

    // Tạo token từ user id
    public String generateToken(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        SecretKey key = Keys.hmacShaKeyFor(getSigningKey());

        return Jwts.builder()
                .subject(userId.toString())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    // Lấy user ID từ token
    public Long getUserIdFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(getSigningKey());
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Long.parseLong(claims.getSubject());
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("Error extracting user ID from token: {}", ex.getMessage());
            return null;
        }
    }

    // Kiểm tra token có hợp lệ không
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(getSigningKey());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("Invalid token: {}", ex.getMessage());
            return false;
        }
    }

    private byte[] getSigningKey() {
        // Ensure the secret is at least 256 bits (32 bytes)
        byte[] secretBytes = jwtSecret.getBytes();
        if (secretBytes.length < 32) {
            // Pad the secret if it's too short
            byte[] paddedSecret = new byte[32];
            System.arraycopy(secretBytes, 0, paddedSecret, 0, secretBytes.length);
            return paddedSecret;
        }
        return secretBytes;
    }
}
