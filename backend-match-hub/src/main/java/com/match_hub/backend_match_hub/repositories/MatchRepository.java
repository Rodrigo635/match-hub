package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE m.championshipId.id = :championshipId")
    Page<Match> findByChampionshipId(@Param("championshipId") Long championshipId, Pageable pageable);

    @Query("""
       SELECT m 
       FROM Match m 
       JOIN m.matchTeams mt 
       JOIN mt.id.team t 
       WHERE t.id = :teamId
       """)
    Page<Match> findByTeamId(@Param("teamId") Long teamId, Pageable pageable);

}