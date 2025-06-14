package com.match_hub.backend_match_hub.services;

import javax.management.relation.Role;

import com.match_hub.backend_match_hub.enums.UserRole;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.match_hub.backend_match_hub.dtos.UserDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;



    public UserDTO registerUser(UserDTO userDTO) {
        try{
            User user = new User(userDTO);
            userRepository.save(user);
       
            return new UserDTO(null, user.getUsername(), null, user.getEmail(), user.getBirthDate(),
                user.getProfilePicture());
        }catch(DataIntegrityViolationException e){
            throw new RuntimeException("Usuário já cadastrado");
        }
    }

    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuário nao encontrado"));
        System.out.println(user);
        return new UserDTO(user.getId(), user.getUsername(), null, user.getEmail(), user.getBirthDate(),
            user.getProfilePicture());
    }


}
