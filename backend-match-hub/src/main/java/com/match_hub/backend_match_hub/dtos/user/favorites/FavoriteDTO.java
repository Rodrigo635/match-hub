package com.match_hub.backend_match_hub.dtos.user.favorites;

import com.fasterxml.jackson.annotation.JsonMerge;

public record FavoriteDTO(
        @JsonMerge Long gameId,
        @JsonMerge Long championshipId,
        @JsonMerge Long teamId
) {}
