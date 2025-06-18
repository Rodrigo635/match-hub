package com.match_hub.backend_match_hub.mapper;


import com.match_hub.backend_match_hub.dtos.user.UserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Conversões básicas para ID
    default User map(Long id) {
        if (id == null) return null;
        User user = new User();
        user.setId(id);
        return user;
    }

    User toEntity(UserDTO userDTO);

    UserDTO toDto(User user);

    UserResponseDTO toResponseDto(User user);
}
