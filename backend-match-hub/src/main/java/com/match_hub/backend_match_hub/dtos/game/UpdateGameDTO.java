package com.match_hub.backend_match_hub.dtos.game;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.Date;
import java.util.List;

public record UpdateGameDTO(

        @Size(min = 1, message = "O nome deve ter pelo menos 1 caractere, se informado")
        String name,

        @Size(min = 1, message = "O nome do torneio deve ter pelo menos 1 caractere, se informado")
        String tournament,

        @Size(min = 20, message = "A descrição deve ter pelo menos 20 caracteres, se informada")
        String description,

        @Size(min = 1, message = "A lista de tags deve conter ao menos uma tag, se informada")
        List<@Size(min = 1, message = "Cada tag deve ter pelo menos 1 caractere") String> tags,


        Date release,

        @Size(min = 1, message = "O gênero deve ter pelo menos 1 caractere, se informado")
        String genre,

        @Size(min = 1, message = "O nome do desenvolvedor deve ter pelo menos 1 caractere, se informado")
        String developer,

        @Size(min = 1, message = "O nome da publicadora deve ter pelo menos 1 caractere, se informado")
        String publisher,

        @Min(value = 0, message = "A classificação etária mínima é 0")
        @Max(value = 18, message = "A classificação etária máxima é 18")
        Integer ageRating,

        Long championshipId

) {}