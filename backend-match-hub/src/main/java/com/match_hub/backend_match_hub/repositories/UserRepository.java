package com.match_hub.backend_match_hub.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import com.match_hub.backend_match_hub.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByName(String username);

    Optional<User> findByEmail(String email);

    Page<User> findByProvider(String provider, PageRequest pageRequest);

    Optional<User> findByEmailAndProvider(String email, String provider);



}
