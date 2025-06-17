package com.match_hub.backend_match_hub.dtos.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

@Schema(description = "Request para completar perfil do usuário OAuth2")
public record CompleteProfileRequestDTO(

    @Past(message = "Birth date must be in the past")
    LocalDate birthDate

) {

}
