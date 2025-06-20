package com.match_hub.backend_match_hub.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ResetPasswordDTO(
        @NotBlank(message = "Password is required") @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
                message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long")
        String password
) {
}
