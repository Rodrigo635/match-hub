package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.game.CreateGameDTO;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.UpdateGameDTO;
import com.match_hub.backend_match_hub.entities.Game;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = ChampionshipMapper.class)
public interface GameMapper {

    // -----------------------------------------
    // MÉTODOS DE MAPEAMENTO -> RESPONSE DTO
    // -----------------------------------------

    /**
     * Converte Game para GameResponseDTO (single).
     */
    @Mapping(target = "championship", source = "championship")
    GameResponseDTO toResponseDto(Game game);

    /**
     * Converte lista de Game para lista de GameResponseDTO.
     */
    List<GameResponseDTO> toResponseDtoList(List<Game> games);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (CREATE)
    // -----------------------------------------

    /**
     * Converte CreateGameDTO para entidade Game.
     * Ignora campo id e createdAt (serão gerados pelo banco).
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Game toEntity(CreateGameDTO createGameDto);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (UPDATE)
    // -----------------------------------------

    /**
     * Atualiza entidade Game com campos do UpdateGameDTO.
     * Apenas campos não-nulos do DTO sobrescrevem a entidade.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateGameDTO updateGameDto, @MappingTarget Game game);

}
