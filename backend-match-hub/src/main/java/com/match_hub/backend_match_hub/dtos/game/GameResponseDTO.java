package com.match_hub.backend_match_hub.dtos.game;

import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDTO;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record GameResponseDTO(
        Long id,
        String name,
        String tournament,
        String image,
        String video,
        String gif,
        String description,
        List<String> tags,
        LocalDate release,
        String genre,
        String developer,
        String publisher,
        Integer ageRating,
        ChampionshipResponseDTO championship,
        Instant createdAt
) {}
