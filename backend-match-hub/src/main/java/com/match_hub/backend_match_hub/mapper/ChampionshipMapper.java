package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDTO;
import com.match_hub.backend_match_hub.dtos.championship.UpdateChampionshipDTO;
import com.match_hub.backend_match_hub.entities.Championship;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MatchMapper.class})
public interface ChampionshipMapper {

    // -----------------------------------------
    // MÉTODOS DE MAPEAMENTO -> RESPONSE DTO
    // -----------------------------------------

    /**
     * Converte Championship para ChampionshipResponseDTO (single),
     * incluindo cálculo de totalMatches.
     */
    @Mapping(target = "totalMatches", expression = "java(championship.getMatches() != null ? championship.getMatches().size() : 0)")
    ChampionshipResponseDTO toResponseDto(Championship championship);

    /**
     * Converte lista de Championship para lista de ChampionshipResponseDTO (completo).
     */
    List<ChampionshipResponseDTO> toResponseDtoList(List<Championship> championships);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (CREATE)
    // -----------------------------------------

    /**
     * Converte CreateChampionshipDTO para entidade Championship.
     * Ignora campo createdAt e matches.
     */
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "matches", ignore = true)
    Championship toEntity(CreateChampionshipDTO createDto);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (UPDATE)
    // -----------------------------------------

    /**
     * Atualiza entidade Championship com campos do UpdateChampionshipDTO.
     * Apenas campos não-nulos do DTO sobrescrevem a entidade.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateChampionshipDTO updateChampionshipDTO, @MappingTarget Championship championship);

}