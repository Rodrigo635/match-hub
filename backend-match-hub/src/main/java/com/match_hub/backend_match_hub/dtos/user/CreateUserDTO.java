package com.match_hub.backend_match_hub.dtos.user;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreateUserDTO(
    @NotBlank(message = "O nome de usuário é obrigatório")
    String name,

    @NotBlank(message = "A senha é obrigatória")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}:;\"'<>?,./]).{8,}$",
        message = "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial"
    )
    String password,

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    String email,

    @NotNull(message = "A data de nascimento é obrigatória")
    @Past(message = "A data de nascimento deve estar no passado")
    LocalDate birthDate

) {}
