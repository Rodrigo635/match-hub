package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String Token);
    void deleteAllByUserId(Long Id);
}
