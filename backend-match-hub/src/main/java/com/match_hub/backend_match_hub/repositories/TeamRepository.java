package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
