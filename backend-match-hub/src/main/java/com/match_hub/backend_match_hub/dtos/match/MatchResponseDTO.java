package com.match_hub.backend_match_hub.dtos.match;

import com.match_hub.backend_match_hub.dtos.match.matchTeam.MatchTeamResponseDTO;

import java.time.LocalTime;
import java.util.List;


public record MatchResponseDTO(
        Long id,
        Long championshipId,
        List<MatchTeamResponseDTO> matchTeams,
        LocalTime hour,
        String link
) {}