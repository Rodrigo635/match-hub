package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.team.CreateTeamDTO;
import com.match_hub.backend_match_hub.dtos.team.TeamDTO;
import com.match_hub.backend_match_hub.dtos.team.UpdateTeamDTO;
import com.match_hub.backend_match_hub.entities.Team;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    TeamDTO toResponseDto(Team team);

    List<TeamDTO> toResponseDtoList(List<Team> teams);

    Team toEntity(CreateTeamDTO createTeamDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateTeamDTO updateTeamDto, @MappingTarget Team team);

}
