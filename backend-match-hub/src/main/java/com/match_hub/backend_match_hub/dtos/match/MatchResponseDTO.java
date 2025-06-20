package com.match_hub.backend_match_hub.dtos.match;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.match_hub.backend_match_hub.dtos.match.matchTeam.MatchTeamResponseDTO;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


public record MatchResponseDTO(
        Long id,
        Long championshipId,
        List<MatchTeamResponseDTO> matchTeams,
        @JsonProperty("date")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate date,
        LocalTime hour,
        String link,
        Instant createdAt
) {}