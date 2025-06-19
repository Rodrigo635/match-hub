package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.user.CreateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UpdateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.infra.exceptions.User.EmailNotFoundException;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserAlreadyExistsException;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.mapper.UserMapper;
import com.match_hub.backend_match_hub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private ProfileImageUploaderService profileImageUploaderService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PageMapper pageMapper;

    public PageResponseDTO<UserResponseDTO> findAll(int page, int size) {
        Page<User> user = userRepository.findAll(PageRequest.of(page, size));
        return pageMapper.toPageResponseDto(user, userMapper::toResponseDto);
    }

    public UserResponseDTO findById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("User not found"));
        return userMapper.toResponseDto(user);
    }

    public UserResponseDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new EmailNotFoundException("Email not found"));
        return userMapper.toResponseDto(user);
    }

    public User save(CreateUserDTO userDTO) {
        if (userRepository.findByName(userDTO.name()).isPresent())
            throw new UserAlreadyExistsException("Username already exists");

        if (userRepository.findByEmail(userDTO.email()).isPresent())
            throw new UserAlreadyExistsException("Email is already in use");

        User user = userMapper.toEntity(userDTO);
        user.setHasPassword(true);
        userRepository.save(user);

        return user;

    }

    public UserResponseDTO update(Long id, UpdateUserDTO updateUserDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("User not found"));
        String password = updateUserDTO.password();
        String newPassword = new BCryptPasswordEncoder().encode(password);
        userMapper.updateEntityFromDto(updateUserDTO, user);
        user.setPassword(newPassword);
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDto(updatedUser);
    }

    public void delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("User not found"));
        userRepository.delete(user);
    }


    public String uploadProfileImage(Long id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("User not found"));

        return profileImageUploaderService.uploadProfileImage(user, file, userRepository, "users");
    }
}
