package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.user.CreateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UpdateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.exceptions.AuthPasswordException;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.infra.exceptions.User.EmailNotFoundException;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserAlreadyExistsException;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.mapper.UserMapper;
import com.match_hub.backend_match_hub.repositories.PasswordResetTokenRepository;
import com.match_hub.backend_match_hub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MediaUploaderService mediaUploaderService;

    @Autowired
    private FileService fileService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PageMapper pageMapper;

    private static final String FOLDER = "users";


    public PageResponseDTO<UserResponseDTO> findAll(int page, int size) {
        Page<User> user = userRepository.findAll(PageRequest.of(page, size, Sort.by("id").ascending()));
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
        user.setPassword(new BCryptPasswordEncoder().encode(userDTO.password()));
        user.setHasPassword(true);
        userRepository.save(user);

        return user;
    }

    public void updateByEmail(String email, UpdateUserDTO updateUserDTO) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ObjectNotFoundException("User not found"));
        if(updateUserDTO.password() != null){
            if(!new BCryptPasswordEncoder().matches(updateUserDTO.currentPassword(), user.getPassword())){ // Verifica se a senha atual corresponde ao hash armazenado no banco de dados
                throw new AuthPasswordException("Incorrect password"); // Se a senha atual for inválida, lançamos uma exceção
            }

            user.setPassword(new BCryptPasswordEncoder().encode(updateUserDTO.password()));
        }
        userMapper.updateEntityFromDto(updateUserDTO, user);
        userRepository.save(user);
    }

    public void updateById(Long id, UpdateUserDTO updateUserDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("User not found"));
        if(updateUserDTO.password() != null){
            user.setPassword(new BCryptPasswordEncoder().encode(updateUserDTO.password()));
        }
        userMapper.updateEntityFromDto(updateUserDTO, user);
        userRepository.save(user);
    }

    public void delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("User not found"));
        passwordResetTokenRepository.deleteAllByUserId(id);
        fileService.deleteImageFolder(FOLDER, id);
        userRepository.delete(user);
    }

    public void deleteImage(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("User not found"));
        fileService.deleteImageFolder(FOLDER, id);
        user.setProfilePicture(null);
        userRepository.save(user);
    }

    public void resetPassword(User user) {
        userRepository.save(user);
    }

    public String uploadMedia(Long id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("User not found"));

        // Deleta a imagem antiga e faz o upload usando MediaUploaderService
        mediaUploaderService.deleteMedia(user, userRepository, FOLDER, MediaUploaderService.MediaType.IMAGE);
        return mediaUploaderService.uploadMedia(user, file, userRepository, FOLDER, MediaUploaderService.MediaType.IMAGE);
    }
}

