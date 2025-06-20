package com.match_hub.backend_match_hub.mapper;


import com.match_hub.backend_match_hub.dtos.user.CreateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UpdateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Conversões básicas para ID
    default User map(Long id) {
        if (id == null) return null;
        User user = new User();
        user.setId(id);
        return user;
    }


    User toEntity(CreateUserDTO CreateUserDTO);

    UserResponseDTO toResponseDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateUserDTO updateUserDTO, @MappingTarget User user);
}
