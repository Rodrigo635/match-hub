package com.match_hub.backend_match_hub.dtos.game;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.List;

public record UpdateGameDto(
        String name,
        String tournament,
        String image,
        String video,
        String gif,
        String description,
        List<String> tags,
        String release,
        String genre,
        String developer,
        String publisher,
        @Min(0) @Max(18) Integer ageRating,
        Long championshipId
) {}