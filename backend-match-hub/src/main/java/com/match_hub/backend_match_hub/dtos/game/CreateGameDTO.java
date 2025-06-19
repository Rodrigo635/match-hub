package com.match_hub.backend_match_hub.dtos.game;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public record CreateGameDTO(
        @NotBlank String name,
        @NotBlank String tournament,
        @NotBlank String video,
        @NotBlank String gif,
        @NotBlank String description,
        List<String> tags,
        @PastOrPresent
        @NotNull
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate release,
        @NotBlank String genre,
        @NotBlank String developer,
        @NotBlank String publisher,
        @NotNull @Min(0) @Max(18) Integer ageRating
) {}