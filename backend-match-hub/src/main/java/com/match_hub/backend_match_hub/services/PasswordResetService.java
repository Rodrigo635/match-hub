package com.match_hub.backend_match_hub.services;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.match_hub.backend_match_hub.entities.PasswordResetToken;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.mapper.UserMapper;
import com.match_hub.backend_match_hub.repositories.PasswordResetTokenRepository;
import com.match_hub.backend_match_hub.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZoneOffset;
import java.util.UUID;

@Service
@Transactional
public class PasswordResetService {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserMapper userMapper;

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ObjectNotFoundException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepository.deleteAllByUserId(user.getId()); // Limpa os tokens anteriores();

        tokenRepository.save(resetToken);

        emailService.sendResetToken(email, token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElseThrow(() -> new ObjectNotFoundException("Invalid token"));

        if (resetToken.isExpired()) {
            tokenRepository.deleteById(resetToken.getId());
            throw new TokenExpiredException("Token has expired", resetToken.getExpiryDate().toInstant(ZoneOffset.UTC));
        }

        User user = resetToken.getUser();
        String encryptedPassword = new BCryptPasswordEncoder().encode(newPassword);
        user.setPassword(encryptedPassword);
        userService.resetPassword(user);

        tokenRepository.delete(resetToken);
    }
}