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

        @Min(value = 0, message = "O tamanho mínimo da fonte é 0")
        @Max(value = 2, message = "O tamanho máximo da fonte é 2")
        Integer fontSize,

        Boolean librasActive,
        Boolean twoFactorEnabled,

        // pode ser null ou lista vazia, mas se vier precisa ser de inteiros
        List<@NotNull Integer> favoriteGames,
        List<@NotNull Integer> favoriteChampionships,
        List<@NotNull Integer> favoriteTeams

) {
}
