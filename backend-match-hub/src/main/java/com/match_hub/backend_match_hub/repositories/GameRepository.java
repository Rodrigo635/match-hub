package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {

    @Override
    Page<Game> findAll(Pageable pageable);
}
