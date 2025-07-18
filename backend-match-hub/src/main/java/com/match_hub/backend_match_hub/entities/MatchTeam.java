package com.match_hub.backend_match_hub.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Table(name = "match_teams")
@Entity
public class MatchTeam implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private MatchTeamPK id;

    public MatchTeam(Team team, Match match) {
        this.id = new MatchTeamPK();
        this.id.setTeam(team);
        this.id.setMatch(match);
    }

    public Team getTeam(){
        return id.getTeam();
    }

    public Match getMatch(){
        return id.getMatch();
    }

}
