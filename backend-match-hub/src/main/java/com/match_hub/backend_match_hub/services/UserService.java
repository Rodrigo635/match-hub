package com.match_hub.backend_match_hub.services;

import javax.management.relation.Role;

import com.match_hub.backend_match_hub.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.match_hub.backend_match_hub.dtos.UserDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDTO registerUser(UserDTO userDTO) {
        try{
            User user = new User(userDTO);
            userRepository.save(user);
       
            return new UserDTO(user.getUsername(), null, user.getEmail(), user.getBirthDate(),
                user.getProfilePicture());
        }catch(DataIntegrityViolationException e){
            throw new RuntimeException("Usuário já cadastrado");
        }
    }
}
