package com.match_hub.backend_match_hub.dtos.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateTeamDTO(

        @NotBlank(message = "O nome do time é obrigatório")
        @NotEmpty(message = "O nome do time é obrigatório")
        String name,

        @Size(min = 20, max = 500, message = "A descrição do time deve ter entre 20 e 500 caracteres")
        String description
) {
}

