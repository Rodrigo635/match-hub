package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.match.CreateMatchDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchResponseDTO;
import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Match;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MatchTeamMapper.class})
public interface MatchMapper {

    @Mapping(target = "championshipId", source = "championshipId")
    MatchResponseDTO toResponseDto(Match Match);

    @Mapping(target = "championshipId", source = "championshipId")
    List<MatchResponseDTO> toResponseDtoList(List<Match> Matches);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "championshipId", ignore = true)
    @Mapping(target = "hour", ignore = true)
    Match toEntity(CreateMatchDTO createMatchDTO);

    default Long map (Championship championship){
        return championship.getId();
    }

    default Championship map(Long championshipId) {
        if (championshipId == null) {
            return null;
        }
        Championship championship = new Championship();
        championship.setId(championshipId);
        return championship;
    }

}

