package com.match_hub.backend_match_hub.dtos.match;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.match_hub.backend_match_hub.dtos.match.matchTeam.MatchTeamDTO;

import java.util.List;

public record CreateMatchDTO(
        Long championshipId,
        List<MatchTeamDTO> matchTeams,
        @JsonProperty("hour")
        @JsonFormat(pattern = "HH:mm")
        String hour,
        String link
) {
}