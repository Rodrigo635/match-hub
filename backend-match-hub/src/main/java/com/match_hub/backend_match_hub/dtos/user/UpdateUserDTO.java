package com.match_hub.backend_match_hub.dtos.user;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UpdateUserDTO(
    String name,

    @Email(message = "Formato de e-mail inválido")
    String email,

    @Past(message = "A data de nascimento deve estar no passado")
    LocalDate birthDate

) {}
