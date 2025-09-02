package com.match_hub.backend_match_hub.dtos.game;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public record CreateGameDTO(

        @NotBlank(message = "O nome do jogo é obrigatório")
        String name,

        @NotBlank(message = "O nome do torneio é obrigatório")
        String tournament,

        @NotBlank(message = "A descrição do jogo é obrigatória")
        @Size(min = 20, max = 500, message = "A descrição do jogo deve ter entre 2 e 500 caracteres")
        String description,

        @NotEmpty(message = "As tags do jogo é obrigatória")
        List<String> tags,

        @NotNull(message = "A data de lançamento é obrigatória")
        @PastOrPresent(message = "A data de lançamento não pode ser no futuro")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate release,

        @NotBlank(message = "O gênero do jogo é obrigatório")
        String genre,

        @NotBlank(message = "O desenvolvedor do jogo é obrigatório")
        String developer,

        @NotBlank(message = "A publicadora do jogo é obrigatória")
        String publisher,

        @NotNull(message = "A classificação etária é obrigatória")
        @Min(value = 0, message = "A classificação etária mínima é 0")
        @Max(value = 18, message = "A classificação etária máxima é 18")
        Integer ageRating

) {}