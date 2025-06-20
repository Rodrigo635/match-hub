package com.match_hub.backend_match_hub.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailDTO(
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email
){
}
