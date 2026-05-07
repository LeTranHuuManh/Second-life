package com.secondlife.backend.security.aspect;

import com.secondlife.backend.domain.enums.UserRole;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.common.exception.ForbiddenException;
import com.secondlife.backend.security.annotation.RequireRole;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class RoleCheckAspect {

    @Before("@annotation(requireRole)")
    public void checkRole(JoinPoint joinPoint, RequireRole requireRole) {
        if (requireRole.value().length == 0) {
            return;
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {
            UserAccount currentUser = (UserAccount) attributes.getRequest().getAttribute("currentUser");
            if (currentUser == null || !Arrays.asList(requireRole.value()).contains(currentUser.getRole())) {
                log.warn("User {} attempted to access restricted resource", currentUser != null ? currentUser.getId() : "unknown");
                throw new ForbiddenException("Bạn không có quyền truy cập tài nguyên này");
            }
        } else {
            throw new ForbiddenException("Không tìm thấy thông tin yêu cầu");
        }
    }
}
