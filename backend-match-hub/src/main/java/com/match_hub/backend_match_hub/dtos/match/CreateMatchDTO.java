package com.match_hub.backend_match_hub.dtos.match;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.match_hub.backend_match_hub.dtos.match.matchTeam.MatchTeamDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateMatchDTO(

        @NotNull(message = "O ID do campeonato é obrigatório")
        Long championshipId,

        @NotNull(message = "A lista de times não pode ser nula")
        @Size(min = 2, message = "O jogo deve ter no mínimo 2 times")
        List<@Valid MatchTeamDTO> teamDTOS,

        @NotNull(message = "A data da partida é obrigatória")
        @JsonProperty("date")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate date,

        @NotBlank(message = "O horário da partida é obrigatório")
        @JsonProperty("hour")
        @JsonFormat(pattern = "HH:mm")
        @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "O horário deve estar no formato HH:mm")
        String hour,

        @NotBlank(message = "O link da partida é obrigatório")
        @Pattern(regexp = "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$", message = "O link deve ser uma URL válida")
        String link

) {}