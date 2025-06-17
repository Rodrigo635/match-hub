package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.match.MatchTeamDTO;
import com.match_hub.backend_match_hub.entities.MatchTeam;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {TeamMapper.class})
public interface MatchTeamMapper {

    MatchTeamDTO toResponseDto(MatchTeam matchTeam);

}
