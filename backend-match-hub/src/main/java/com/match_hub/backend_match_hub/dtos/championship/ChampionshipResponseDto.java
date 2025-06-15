package com.match_hub.backend_match_hub.dtos.championship;

import com.match_hub.backend_match_hub.dtos.MatchDto;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDto;
import com.match_hub.backend_match_hub.entities.Game;

import java.time.Instant;
import java.util.List;

public record ChampionshipResponseDto(
        Long id,
        String name,
        String imageChampionship,
        Instant createdAt,
        List<MatchDto> matches,
        Integer totalMatches
) {}
