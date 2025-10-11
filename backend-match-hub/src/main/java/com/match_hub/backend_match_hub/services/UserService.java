package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.TokenDTO;
import com.match_hub.backend_match_hub.dtos.user.CreateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UpdateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserCredentialDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Game;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.exceptions.AuthPasswordException;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserAlreadyExistsException;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.mapper.UserMapper;
import com.match_hub.backend_match_hub.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private MediaUploaderService mediaUploaderService;

    @Autowired
    private FileService fileService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private ChampionshipRepository championshipRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PageMapper pageMapper;

    @Autowired
    private TwoFactorService twoFactorService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    private static final String FOLDER = "users";


    public PageResponseDTO<UserResponseDTO> findAll(int page, int size) {
        Page<User> user = userRepository.findAll(PageRequest.of(page, size, Sort.by("id").ascending()));
        return pageMapper.toPageResponseDto(user, userMapper::toResponseDto);
    }

    public UserResponseDTO findById(Long id) {
        User user = getUserOrThrow(id);
        return userMapper.toResponseDto(user);
    }

    public UserResponseDTO findByEmail(String email) {
        User user = getUserByEmailOrThrow(email);
        return userMapper.toResponseDto(user);
    }

    public User save(CreateUserDTO userDTO) {
        if (userRepository.findByName(userDTO.name()).isPresent())
            throw new UserAlreadyExistsException("Username already exists");

        if (userRepository.findByEmail(userDTO.email()).isPresent())
            throw new UserAlreadyExistsException("Email is already in use");

        //Verifica se os favoritos são validos

        User user = userMapper.toEntity(userDTO);
        user.setPassword(new BCryptPasswordEncoder().encode(userDTO.password()));
        user.setHasPassword(true);
        userRepository.save(user);

        return user;
    }

    public void updateByEmail(String email, UpdateUserDTO updateUserDTO) {
        User user = getUserByEmailOrThrow(email);
        if (updateUserDTO.password() != null) {
            if (!new BCryptPasswordEncoder().matches(updateUserDTO.currentPassword(), user.getPassword())) { // Verifica se a senha atual corresponde ao hash armazenado no banco de dados
                throw new AuthPasswordException("Incorrect password"); // Se a senha atual for inválida, lançamos uma exceção
            }

            user.setPassword(new BCryptPasswordEncoder().encode(updateUserDTO.password()));
        }
        userMapper.updateEntityFromDto(updateUserDTO, user);
        userRepository.save(user);
    }

    public void updateById(Long id, UpdateUserDTO updateUserDTO) {
        User user = getUserOrThrow(id);
        if (updateUserDTO.password() != null) {
            user.setPassword(new BCryptPasswordEncoder().encode(updateUserDTO.password()));
        }
        userMapper.updateEntityFromDto(updateUserDTO, user);
        userRepository.save(user);
    }

    public void addFavoriteGame(String email, Long gameId) {
        User user = getUserByEmailOrThrow(email);
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        if (!user.getFavoriteGames().contains(game)) {
            user.getFavoriteGames().add(game);
            userRepository.save(user);
        }
    }

    public void addFavoriteChampionship(String email, Long championshipId) {
        User user = getUserByEmailOrThrow(email);
        Championship championship = championshipRepository.findById(championshipId)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        if (!user.getFavoriteChampionships().contains(championship)) {
            user.getFavoriteChampionships().add(championship);
            userRepository.save(user);
        }
    }

    public void addFavoriteTeam(String email, Long teamId) {
        User user = getUserByEmailOrThrow(email);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        if (!user.getFavoriteTeams().contains(team)) {
            user.getFavoriteTeams().add(team);
            userRepository.save(user);
        }
    }

    public void removeFavoriteGame(String email, Long gameId) {
        User user = getUserByEmailOrThrow(email);
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        if (user.getFavoriteGames().remove(game)) { // remove se existir
            userRepository.save(user);
        }
    }

    public void removeFavoriteChampionship(String email, Long championshipId) {
        User user = getUserByEmailOrThrow(email);
        Championship championship = championshipRepository.findById(championshipId)
                .orElseThrow(() -> new ObjectNotFoundException("Championship not found"));

        if (user.getFavoriteChampionships().remove(championship)) {
            userRepository.save(user);
        }
    }

    public void removeFavoriteTeam(String email, Long teamId) {
        User user = getUserByEmailOrThrow(email);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ObjectNotFoundException("Team not found"));

        if (user.getFavoriteTeams().remove(team)) {
            userRepository.save(user);
        }
    }

    public void removeAllFavorites(String email) {
        User user = getUserByEmailOrThrow(email);
        user.getFavoriteTeams().clear();
        user.getFavoriteGames().clear();
        user.getFavoriteChampionships().clear();
        userRepository.save(user);
    }


    public void delete(Long id) {
        User user = getUserOrThrow(id);

        passwordResetTokenRepository.deleteAllByUserId(id);
        fileService.deleteImageFolder(FOLDER, id);
        userRepository.delete(user);
    }

    public void deleteImage(Long id) {
        User user = getUserOrThrow(id);

        fileService.deleteImageFolder(FOLDER, id);
        user.setProfilePicture(null);
        userRepository.save(user);
    }

    public void resetPassword(User user) {
        userRepository.save(user);
    }

    public String uploadMedia(Long id, MultipartFile file) {
        User user = getUserOrThrow(id);

        // Deleta a imagem antiga e faz o upload usando MediaUploaderService
        mediaUploaderService.deleteMedia(user, userRepository, FOLDER, MediaUploaderService.MediaType.IMAGE);
        return mediaUploaderService.uploadMedia(user, file, userRepository, FOLDER, MediaUploaderService.MediaType.IMAGE);
    }

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("User not found"));
    }

    private User getUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ObjectNotFoundException("User not found"));
    }

    public void setAvatar(long id, String avatarURL) {
        User user = getUserOrThrow(id);
        user.setProfilePicture(avatarURL);
        userRepository.save(user);
    }

    public String enableTwoFactor(User user) {
        String secret = twoFactorService.generateSecretKey();
        user.setTwoFactorSecret(secret);
        user.setTwoFactorEnabled(true);
        userRepository.save(user);

        return twoFactorService.getOtpAuthURL(user.getEmail(), secret);
    }

    public Object login(UserCredentialDTO userDTO) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password())
        );

        User user = (User) auth.getPrincipal();

        if (user.getTwoFactorEnabled()) {
            // Apenas retorna info que 2FA é necessário
            return Map.of(
                    "require2FA", true,
                    "email", user.getEmail()
            );
        }

        // Se não tiver 2FA, retorna token
        String jwt = tokenService.generateToken(user);
        return new TokenDTO(jwt);
    }


    public TokenDTO verifyTwoFactor(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean valid = twoFactorService.verifyCode(user.getTwoFactorSecret(), code);
        if (!valid) throw new RuntimeException("Invalid 2FA code");

        String jwt = tokenService.generateToken(user);
        return new TokenDTO(jwt);
    }

    public void disableTwoFactor(UpdateUserDTO user) {
        User userEntity = getUserByEmailOrThrow(user.email());
        userEntity.setTwoFactorEnabled(false);
        userEntity.setTwoFactorSecret(null);
        userRepository.save(userEntity);
    }
}

