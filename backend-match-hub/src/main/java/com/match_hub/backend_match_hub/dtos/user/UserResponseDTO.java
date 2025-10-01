package com.match_hub.backend_match_hub.dtos.user;

import com.match_hub.backend_match_hub.dtos.user.favorites.FavoriteChampionshipsDTO;
import com.match_hub.backend_match_hub.dtos.user.favorites.FavoriteGamesDTO;
import com.match_hub.backend_match_hub.dtos.user.favorites.FavoriteTeamsDTO;
import com.match_hub.backend_match_hub.entities.Notification;
import com.match_hub.backend_match_hub.enums.UserRole;
import jakarta.persistence.Enumerated;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

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
        Boolean librasActive,
        Boolean isDarkMode,
        List<Notification> notifications,
        List<FavoriteGamesDTO> favoriteGames,
        List<FavoriteChampionshipsDTO> favoriteChampionships,
        List<FavoriteTeamsDTO> favoriteTeams
) {}

