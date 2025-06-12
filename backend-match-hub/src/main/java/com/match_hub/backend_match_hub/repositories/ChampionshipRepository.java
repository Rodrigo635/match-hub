package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.Championship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChampionshipRepository extends JpaRepository<Championship, Long> {
}
