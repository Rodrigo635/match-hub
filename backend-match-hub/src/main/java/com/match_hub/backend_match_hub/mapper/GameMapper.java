package com.match_hub.backend_match_hub.mapper;

import com.match_hub.backend_match_hub.dtos.game.CreateGameDto;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDto;
import com.match_hub.backend_match_hub.dtos.game.UpdateGameDto;
import com.match_hub.backend_match_hub.entities.Game;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = ChampionshipMapper.class)
public interface GameMapper {

    // Conversão para resposta completa
    GameResponseDto toResponseDto(Game game);

    // Conversão de lista
    List<GameResponseDto> toResponseDtoList(List<Game> games);

    // Conversão de CreateGameDto para Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Game toEntity(CreateGameDto createGameDto);

    // Conversão de UpdateGameDto para Entity (para merge)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateGameDto updateGameDto, @MappingTarget Game game);

}
