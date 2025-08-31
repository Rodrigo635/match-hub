package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChampionshipRepository extends JpaRepository<Championship, Long> {

    @Override
    Page<Championship> findAll(Pageable pageable);

    @Query("SELECT c FROM Championship c WHERE c.game.id = :gameId")
    Page<Championship> findByGameId(@Param("gameId") Long gameId, Pageable pageable);

}
