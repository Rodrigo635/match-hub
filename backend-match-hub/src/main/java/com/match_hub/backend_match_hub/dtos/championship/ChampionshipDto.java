package com.match_hub.backend_match_hub.dtos.championship;

import com.match_hub.backend_match_hub.dtos.MatchDto;

import java.util.List;

public record ChampionshipDto(
        Long id,
        String name,
        String imageChampionship,
        List<MatchDto> matches
) {}