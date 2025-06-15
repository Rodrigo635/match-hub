package com.match_hub.backend_match_hub.dtos.game;

import com.match_hub.backend_match_hub.dtos.championship.ChampionshipDto;

import java.time.Instant;
import java.util.List;

public record GameResponseDto(
        Long id,
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
        Integer ageRating,
        Instant createdAt,
        ChampionshipDto championship
) {}
