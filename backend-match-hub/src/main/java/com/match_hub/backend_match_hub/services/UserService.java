package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.infra.exceptions.User.EmailNotFoundException;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserAlreadyExistsException;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.match_hub.backend_match_hub.dtos.user.UserDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserMapper userMapper;



    public UserDTO registerUser(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.username()).isPresent()) throw new UserAlreadyExistsException("Username already exists");

        if (userRepository.findByEmail(userDTO.email()).isPresent()) throw new UserAlreadyExistsException("Email is already in use");

        User user = userMapper.toEntity(userDTO);
        user.setHasPassword(true);
        userRepository.save(user);

        return new UserDTO(null, user.getUsername(), null, user.getEmail(), user.getBirthDate(),
            user.getProfilePicture());

    }

    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new EmailNotFoundException("Email not found"));
        return new UserDTO(user.getId(), user.getUsername(), null, user.getEmail(), user.getBirthDate(),
            user.getProfilePicture());
    }


}
