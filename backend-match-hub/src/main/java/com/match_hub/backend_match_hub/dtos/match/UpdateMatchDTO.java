package com.match_hub.backend_match_hub.dtos.match;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.match_hub.backend_match_hub.dtos.match.matchTeam.MatchTeamDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record UpdateMatchDTO(

        Long championshipId,

        @Size(min = 2, message = "O jogo deve ter no mínimo 2 times")
        List<@Valid MatchTeamDTO> teamDTOS,

        @JsonProperty("date")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate date,

        @JsonProperty("hour")
        @JsonFormat(pattern = "HH:mm")
        @Pattern(
                regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$",
                message = "O horário deve estar no formato HH:mm"
        )
        String hour,

        @Pattern(
                regexp = "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$",
                message = "O link deve ser uma URL válida"
        )
        String link

) {}
