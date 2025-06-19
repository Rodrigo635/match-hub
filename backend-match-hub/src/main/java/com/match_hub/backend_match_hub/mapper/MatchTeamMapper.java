package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.match.matchTeam.MatchTeamDTO;
import com.match_hub.backend_match_hub.entities.MatchTeam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {TeamMapper.class})
public interface MatchTeamMapper {

    @Mapping(target = "teamId", source = "team.id")
    MatchTeamDTO toResponseDto(MatchTeam matchTeam);

}
