package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.championship.ChampionshipDto;
import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDto;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDto;
import com.match_hub.backend_match_hub.entities.Championship;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MatchMapper.class})
public interface ChampionshipMapper {

    // Conversões básicas para ID
    default Championship map(Long id) {
        if (id == null) return null;
        Championship championship = new Championship();
        championship.setId(id);
        return championship;
    }

    // Conversão para DTO simples
    ChampionshipDto toDto(Championship championship);

    // Conversão para resposta completa com matches
    @Mapping(target = "totalMatches", expression = "java(championship.getMatches() != null ? championship.getMatches().size() : 0)")
    ChampionshipResponseDto toResponseDto(Championship championship);

    // Conversão de lista para DTOs simples
    List<ChampionshipDto> toDtoList(List<Championship> championships);

    // Conversão de lista para resposta completa
    List<ChampionshipResponseDto> toResponseDtoList(List<Championship> championships);

    // Conversão de CreateDto para Entity
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "matches", ignore = true)
    Championship toEntity(CreateChampionshipDto createDto);
}