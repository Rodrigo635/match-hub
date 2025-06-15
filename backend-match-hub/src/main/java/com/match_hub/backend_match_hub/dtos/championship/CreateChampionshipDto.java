package com.match_hub.backend_match_hub.dtos.championship;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateChampionshipDto(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,

        @Pattern(regexp = "^(https?://).*\\.(jpg|jpeg|png|gif|webp)$",
                message = "Image URL must be a valid HTTP/HTTPS URL ending with jpg, jpeg, png, gif, or webp")
        String imageChampionship,
        @NotNull (message = "Game is required")
        Long gameId
) {}
