package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.MatchDto;
import com.match_hub.backend_match_hub.entities.Match;
import org.mapstruct.Mapper;

import java.util.List;

// Mapper para Match (básico para evitar dependência circular)
@Mapper(componentModel = "spring")
public interface MatchMapper {

    MatchDto toDto(Match match);

    List<MatchDto> toSummaryDtoList(List<Match> matches);
}

