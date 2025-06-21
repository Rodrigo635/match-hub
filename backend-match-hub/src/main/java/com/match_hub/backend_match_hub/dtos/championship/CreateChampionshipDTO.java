package com.match_hub.backend_match_hub.dtos.championship;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateChampionshipDTO(
        @NotBlank(message = "Nome é necessário")
        @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
        String name,

        @NotNull (message = "Jogo é necessário")
        Long gameId
) {}
