package com.match_hub.backend_match_hub.mapper;


import com.match_hub.backend_match_hub.dtos.user.CreateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UpdateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (CREATE)
    // -----------------------------------------

    /**
     * Converte CreateUserDTO para entidade User.
     */
    @Mapping(target = "password", ignore = true)
    User toEntity(CreateUserDTO createUserDTO);

    // -----------------------------------------
    // MÉTODOS DE MAPEAMENTO -> RESPONSE DTO
    // -----------------------------------------

    /**
     * Converte User para UserResponseDTO (single).
     */
    @Mapping(target = "favoriteGames", source = "favoriteGames")
    @Mapping(target = "favoriteChampionships", source = "favoriteChampionships")
    @Mapping(target = "favoriteTeams", source = "favoriteTeams")
    UserResponseDTO toResponseDto(User user);

    // -----------------------------------------
    // MÉTODO DE MAPEAMENTO -> ENTITY (UPDATE)
    // -----------------------------------------

    /**
     * Atualiza entidade User com campos do UpdateUserDTO.
     * Apenas campos não-nulos do DTO sobrescrevem a entidade.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "favoriteGames", ignore = true)
    @Mapping(target = "favoriteChampionships", ignore = true)
    @Mapping(target = "favoriteTeams", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateUserDTO updateUserDTO, @MappingTarget User user);


}
