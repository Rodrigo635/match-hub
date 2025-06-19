package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.match.CreateMatchDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.UpdateMatchDTO;
import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Match;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MatchTeamMapper.class})
public interface MatchMapper {

    @Mapping(target = "championshipId", source = "championship")
    MatchResponseDTO toResponseDto(Match Match);

    List<MatchResponseDTO> toResponseDtoList(List<Match> Matches);
    Match toEntity(CreateMatchDTO createMatchDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateMatchDTO updateMatchDto, @MappingTarget Match Match);

    default Long map (Championship championship){
        return championship.getId();
    }
}

