package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.MatchTeam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchTeamRepository extends JpaRepository<MatchTeam, Long> {
}
