package com.match_hub.backend_match_hub.dtos.championship;

import com.match_hub.backend_match_hub.dtos.match.MatchDTO;

import java.time.Instant;
import java.util.List;

public record ChampionshipResponseDTO(
        Long id,
        String name,
        String imageChampionship,
        Instant createdAt,
        List<MatchDTO> matches,
        Integer totalMatches
) {}
