package com.match_hub.backend_match_hub.dtos.game;

import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public record CreateGameDto(
        @NotBlank String name,
        @NotBlank String tournament,
        @NotBlank String image,
        @NotBlank String video,
        @NotBlank String gif,
        @NotBlank String description,
        List<String> tags,
        @PastOrPresent
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        @NotBlank Date release,
        @NotBlank String genre,
        @NotBlank String developer,
        @NotBlank String publisher,
        @NotNull @Min(0) @Max(18) Integer ageRating
) {}