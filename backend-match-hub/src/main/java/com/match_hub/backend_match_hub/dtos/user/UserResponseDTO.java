package com.match_hub.backend_match_hub.dtos.user;

import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.enums.UserRole;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

public record UserResponseDTO(
        Long id,
        String username,
        String email,
        LocalDate birthDate,
        String profilePicture,
        @Enumerated
        UserRole role,
        String provider,
        String googleId,
        boolean hasPassword
) {
    public static UserResponseDTO fromEntity(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBirthDate(),
                user.getProfilePicture(),
                user.getRole(),
                user.getProvider(),
                user.getGoogleId(),
                user.getPassword() != null
        );
    }
}

