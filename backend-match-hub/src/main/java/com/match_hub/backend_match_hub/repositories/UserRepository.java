package com.match_hub.backend_match_hub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.match_hub.backend_match_hub.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findByProvider(String provider);

    Optional<User> findByEmailAndProvider(String email, String provider);



}
