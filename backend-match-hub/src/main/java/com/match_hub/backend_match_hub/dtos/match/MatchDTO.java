package com.match_hub.backend_match_hub.dtos.match;

import java.time.LocalTime;
import java.util.List;


public record MatchDTO(
        Long id,
        Long championshipId,
        List<MatchTeamDTO> matchTeams,
        LocalTime hour,
        String link
) {}