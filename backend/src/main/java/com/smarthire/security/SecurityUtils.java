package com.smarthire.security;

import com.smarthire.entity.Role;
import com.smarthire.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityUtils {

    public static Optional<UserPrincipal> getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return Optional.of((UserPrincipal) authentication.getPrincipal());
        }
        return Optional.empty();
    }

    public static Long getCurrentUserId() {
        return getCurrentUserPrincipal()
                .map(UserPrincipal::getId)
                .orElseThrow(() -> new UnauthorizedException("User is not authenticated"));
    }

    public static Role getCurrentUserRole() {
        return getCurrentUserPrincipal()
                .map(UserPrincipal::getRole)
                .orElseThrow(() -> new UnauthorizedException("User is not authenticated"));
    }

    public static boolean hasRole(Role role) {
        return getCurrentUserPrincipal()
                .map(u -> u.getRole() == role)
                .orElse(false);
    }
}
