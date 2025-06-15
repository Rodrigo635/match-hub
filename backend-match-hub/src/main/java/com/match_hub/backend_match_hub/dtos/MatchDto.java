package com.match_hub.backend_match_hub.dtos;

import java.time.LocalTime;

public record MatchDto(
        Long id,
        LocalTime hour
) {}