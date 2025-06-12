package com.match_hub.backend_match_hub.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.match_hub.backend_match_hub.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    User findByEmail(String email);
}
