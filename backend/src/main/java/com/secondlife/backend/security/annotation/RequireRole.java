package com.secondlife.backend.security.annotation;

import com.secondlife.backend.domain.enums.UserRole;
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireRole {
    UserRole[] value() default {};
}
