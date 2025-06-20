package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.match.CreateMatchDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.UpdateMatchDTO;
import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Match;
import org.mapstruct.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Mapper(componentModel = "spring", uses = {MatchTeamMapper.class})
public interface MatchMapper {


    // -----------------------------------------
    // MÉTODOS DE MAPEAMENTO -> RESPONSE DTO
    // -----------------------------------------

    /**
     * Converte Match para MatchResponseDTO (single).
     * Transforma championship (entidade) em championshipId (Long).
     */
    @Mapping(target = "championshipId", source = "championshipId", qualifiedByName = "ChampionshipToLong")
    MatchResponseDTO toResponseDto(Match match);

    /**
     * Converte lista de Match para lista de MatchResponseDTO.
     */
    @Mapping(target = "championshipId", source = "championshipId", qualifiedByName = "ChampionshipToLong")
    List<MatchResponseDTO> toResponseDtoList(List<Match> matches);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (CREATE)
    // -----------------------------------------

    /**
     * Converte CreateMatchDTO para entidade Match.
     * Converte championshipId (Long) para Championship.
     * Converte hour (String) para LocalTime.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "championshipId", source = "championshipId", qualifiedByName = "LongToChampionship")
    @Mapping(target = "hour", source = "hour", qualifiedByName = "stringToLocalTime")
    @Mapping(target = "createdAt", ignore = true)
    Match toEntity(CreateMatchDTO createMatchDTO);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (UPDATE)
    // -----------------------------------------

    /**
     * Atualiza entidade Match com campos do UpdateMatchDTO.
     * Apenas campos não-nulos do DTO sobrescrevem a entidade.
     */
    @Mapping(target = "championshipId", source = "championshipId", qualifiedByName = "LongToChampionship")
    @Mapping(target = "hour", source = "hour", qualifiedByName = "stringToLocalTime")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateMatchDTO dto, @MappingTarget Match entity);

    // -----------------------------------------
    // MÉTODOS DE CONVERSÃO PERSONALIZADA
    // -----------------------------------------

    /**
     * Converte Championship para Long (championshipId).
     */
    @Named("ChampionshipToLong")
    default Long map(Championship championship) {
        return championship != null ? championship.getId() : null;
    }

    /**
     * Converte Long (championshipId) para entidade Championship (stub com id).
     */
    @Named("LongToChampionship")
    default Championship mapChampionship(Long championshipId) {
        if (championshipId == null) return null;
        Championship c = new Championship();
        c.setId(championshipId);
        return c;
    }

    /**
     * Converte String hour ("HH:mm") para LocalTime.
     * Lança IllegalArgumentException em caso de formato inválido.
     */
    @Named("stringToLocalTime")
    default LocalTime stringToLocalTime(String hour) {
        if (hour == null || hour.isBlank()) return null;
        try {
            return LocalTime.parse(hour, DateTimeFormatter.ofPattern("HH:mm"));
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Hora inválida, formato esperado HH:mm: " + hour);
        }
    }

}

