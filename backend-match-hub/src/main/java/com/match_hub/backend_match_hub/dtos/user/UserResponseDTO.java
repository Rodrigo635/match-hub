package com.match_hub.backend_match_hub.dtos.user;

import com.match_hub.backend_match_hub.enums.UserRole;
import jakarta.persistence.Enumerated;

import java.time.Instant;
import java.time.LocalDate;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        LocalDate birthDate,
        String profilePicture,
        @Enumerated
        UserRole role,
        String provider,
        String googleId,
        Instant createdAt,
        Boolean hasPassword,
        Integer fontSize,
        Boolean vLibrasActive,
        Boolean isDarkMode
) {}

