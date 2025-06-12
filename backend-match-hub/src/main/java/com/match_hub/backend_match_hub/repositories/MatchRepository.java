package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
}
