package com.match_hub.backend_match_hub.entities;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@EqualsAndHashCode
@Embeddable
public class MatchTeamPK implements Serializable {

    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
}
