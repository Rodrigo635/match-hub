package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.game.CreateGameDTO;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.UpdateGameDTO;
import com.match_hub.backend_match_hub.entities.Game;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = ChampionshipMapper.class)
public interface GameMapper {

    // Conversão para resposta completa
    GameResponseDTO toResponseDto(Game game);

    // Conversão de lista
    List<GameResponseDTO> toResponseDtoList(List<Game> games);

    // Conversão de CreateGameDto para Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Game toEntity(CreateGameDTO createGameDto);

    // Conversão de UpdateGameDto para Entity (para merge)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateGameDTO updateGameDto, @MappingTarget Game game);

}
