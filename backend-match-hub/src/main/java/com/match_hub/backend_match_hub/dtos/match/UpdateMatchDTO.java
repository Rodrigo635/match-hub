package com.match_hub.backend_match_hub.dtos.match;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.match_hub.backend_match_hub.dtos.match.matchTeam.MatchTeamDTO;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

public record UpdateMatchDTO(
        Long championshipId,
        List<@Valid MatchTeamDTO> teamDTOS,
        @JsonProperty("date")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate date,
        @JsonProperty("hour")
        @JsonFormat(pattern = "HH:mm")
        String hour,
        String link
) {}
