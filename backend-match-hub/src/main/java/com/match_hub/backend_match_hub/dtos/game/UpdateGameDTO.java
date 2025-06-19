package com.match_hub.backend_match_hub.dtos.game;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.Date;
import java.util.List;

public record UpdateGameDTO(
        String name,
        String tournament,
        String video,
        String gif,
        String description,
        List<String> tags,
        Date release,
        String genre,
        String developer,
        String publisher,
        @Min(0) @Max(18) Integer ageRating,
        Long championshipId
) {}