package com.match_hub.backend_match_hub.dtos.user;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UpdateUserDTO(
    String name,

    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}:;\"'<>?,./]).{8,}$",
        message = "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula e um caractere especial"
    )
    String password,

    @Email(message = "Formato de e-mail inválido")
    String email,

    @Past(message = "A data de nascimento deve estar no passado")
    LocalDate birthDate

) {}
