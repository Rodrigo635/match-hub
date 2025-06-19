package com.match_hub.backend_match_hub.dtos.championship;

import com.match_hub.backend_match_hub.dtos.match.MatchResponseDTO;

import java.time.Instant;
import java.util.List;

public record ChampionshipResponseDTO(
        Long id,
        String name,
        String imageChampionship,
        Instant createdAt,
        List<MatchResponseDTO> matches,
        Integer totalMatches
) {}
