package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.team.CreateTeamDTO;
import com.match_hub.backend_match_hub.dtos.team.TeamResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.UpdateTeamDTO;
import com.match_hub.backend_match_hub.entities.Team;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    // -----------------------------------------
    // MÉTODOS DE MAPEAMENTO -> RESPONSE DTO
    // -----------------------------------------

    /**
     * Converte Team para TeamResponseDTO (single).
     */
    TeamResponseDTO toResponseDto(Team team);

    /**
     * Converte lista de Team para lista de TeamResponseDTO.
     */
    List<TeamResponseDTO> toResponseDtoList(List<Team> teams);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (CREATE)
    // -----------------------------------------

    /**
     * Converte CreateTeamDTO para entidade Team.
     */
    Team toEntity(CreateTeamDTO createTeamDTO);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (UPDATE)
    // -----------------------------------------

    /**
     * Atualiza entidade Team com campos do UpdateTeamDTO.
     * Apenas campos não-nulos do DTO sobrescrevem a entidade.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateTeamDTO updateTeamDto, @MappingTarget Team team);

}
