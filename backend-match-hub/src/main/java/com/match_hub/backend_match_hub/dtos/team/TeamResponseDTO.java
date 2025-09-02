package com.match_hub.backend_match_hub.dtos.team;

import java.time.Instant;

public record TeamResponseDTO(
        Long id,
        String name,
        String description,
        String logo,
        Instant createdAt
) {}

