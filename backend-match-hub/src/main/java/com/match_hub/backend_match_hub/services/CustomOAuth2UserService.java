package  com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.user.CompleteProfileRequestDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.GoogleAuth.CustomOAuth2User;
import com.match_hub.backend_match_hub.infra.GoogleAuth.GoogleOAuth2UserInfo;
import com.match_hub.backend_match_hub.infra.exceptions.User.TokenInvalidException;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserNotFoundException;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.mapper.UserMapper;
import com.match_hub.backend_match_hub.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PageMapper pageMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException("Error processing OAuth2: " + ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        GoogleOAuth2UserInfo userInfo = new GoogleOAuth2UserInfo(oauth2User.getAttributes());

        if (userInfo.getEmail() == null || userInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found in OAuth2 response");
        }

        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            user = updateExistingUser(user, userInfo);
        } else {
            user = registerNewUser(userInfo);
        }

        return new CustomOAuth2User(oauth2User.getAttributes(), user);
    }

    private User registerNewUser(GoogleOAuth2UserInfo userInfo) {
        User user = new User();
        user.setEmail(userInfo.getEmail());
        user.setName(userInfo.getName());
        user.setPassword(null);
        user.setBirthDate(null);
        user.setProfilePicture(userInfo.getImageUrl()); // Foto do perfil do Google
        user.setGoogleId(userInfo.getId());
        user.setProvider("GOOGLE");

        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, GoogleOAuth2UserInfo userInfo) {
        // Atualizar informações do Google se necessário
        if (existingUser.getProfilePicture() == null && userInfo.getImageUrl() != null) {
            existingUser.setProfilePicture(userInfo.getImageUrl());
        }

        if (existingUser.getGoogleId() == null) {
            existingUser.setGoogleId(userInfo.getId());
            existingUser.setProvider("GOOGLE");
        }

        // Garantir que username existe para OAuth2
        if (existingUser.getUsername() == null) {
            existingUser.setName(existingUser.getEmail());
        }

        return userRepository.save(existingUser);
    }

    public Map<String, Object> simulateOAuth2Token(String email) {
        User user = userRepository.findByEmailAndProvider(email, "GOOGLE")
                .orElseThrow(() -> new UserNotFoundException("User OAuth2 not found"));

        String token = tokenService.generateToken(user);

        return Map.of(
                "token", token,
                "user", userMapper.toResponseDto(userRepository.save(user)),
                "message", "Token generated for an existing user"
        );
    }

    public PageResponseDTO<UserResponseDTO> findByProvider(String provider, Integer page, Integer size) {
        Page<User> user = userRepository.findByProvider(provider, PageRequest.of(page, size));
        if(user.isEmpty()) throw new UserNotFoundException("User not found");
        return pageMapper.toPageResponseDto(user, userMapper::toResponseDto);
    }
}