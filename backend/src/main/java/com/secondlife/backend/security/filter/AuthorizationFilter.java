package com.secondlife.backend.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.secondlife.backend.common.response.BaseResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class AuthorizationFilter extends OncePerRequestFilter {
    private static final String[] PUBLIC_URLS = {
            "/api/auth/login",
            "/api/auth/register",
            "/health",
            "/info"
    };

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestPath = request.getRequestURI();

        // Skip public URLs
        if (isPublicUrl(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check if user is authenticated (401)
        if (SecurityContextHolder.getContext().getAuthentication() == null ||
                !SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            sendErrorResponse(response, 401, "Bạn chưa đăng nhập");
            return;
        }

        // Check authorization (403)
        if (!hasRequiredRole(request)) {
            sendErrorResponse(response, 403, "Bạn không có quyền truy cập tài nguyên này");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicUrl(String requestPath) {
        for (String url : PUBLIC_URLS) {
            if (requestPath.startsWith(url)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasRequiredRole(HttpServletRequest request) {
        // In a real application, you would check if the user has the required role
        // based on the endpoint they're trying to access.
        // For now, we'll assume all authenticated users have access.
        return true;
    }

    private void sendErrorResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json;charset=UTF-8");
        BaseResponse<?> errorResponse = BaseResponse.error(statusCode, message);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
