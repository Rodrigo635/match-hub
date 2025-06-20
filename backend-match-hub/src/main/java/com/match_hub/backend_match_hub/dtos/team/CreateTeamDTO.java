package com.match_hub.backend_match_hub.dtos.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record CreateTeamDTO(

        @NotBlank(message = "O nome do time é obrigatório")
        @NotEmpty(message = "O nome do time é obrigatório")
        String name
) {}

