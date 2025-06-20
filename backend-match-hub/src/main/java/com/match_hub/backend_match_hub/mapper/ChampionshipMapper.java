package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDTO;
import com.match_hub.backend_match_hub.dtos.championship.UpdateChampionshipDTO;
import com.match_hub.backend_match_hub.entities.Championship;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MatchMapper.class})
public interface ChampionshipMapper {

    // Conversões básicas para ID
    default Championship map(Long value) {
        if (value == null) return null;
        Championship championship = new Championship();
        championship.setId(value);
        return championship;
    }

    // Conversão para resposta completa com matches
    @Mapping(target = "totalMatches", expression = "java(championship.getMatches() != null ? championship.getMatches().size() : 0)")
    ChampionshipResponseDTO toResponseDto(Championship championship);

    // Conversão de lista para DTOs simples
    List<ChampionshipResponseDTO> toDtoList(List<Championship> championships);

    // Conversão de lista para resposta completa
    List<ChampionshipResponseDTO> toResponseDtoList(List<Championship> championships);

    // Conversão de CreateDto para Entity
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "matches", ignore = true)
    Championship toEntity(CreateChampionshipDTO createDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateChampionshipDTO updateChampionshipDTO, @MappingTarget Championship championship);
}