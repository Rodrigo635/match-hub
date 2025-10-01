package com.match_hub.backend_match_hub.dtos.user;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record UpdateUserDTO(

        @Size(min = 3, message = "O nome deve ter pelo menos 3 caracteres")
        String name,

        @Email(message = "Formato de e-mail inválido")
        String email,

        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}:;\"'<>?,./]).{8,}$",
                message = "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial"
        )
        String password,

        String currentPassword,

        @Past(message = "A data de nascimento deve estar no passado")
        LocalDate birthDate,

        Boolean isDarkMode,

        @Min(value = 10, message = "O tamanho mínimo da fonte é 10")
        @Max(value = 30, message = "O tamanho máximo da fonte é 30")
        Integer fontSize,

        Boolean librasActive,

        // pode ser null ou lista vazia, mas se vier precisa ser de inteiros
        List<@NotNull Integer> favoriteGames,
        List<@NotNull Integer> favoriteChampionships,
        List<@NotNull Integer> favoriteTeams

) {
}
