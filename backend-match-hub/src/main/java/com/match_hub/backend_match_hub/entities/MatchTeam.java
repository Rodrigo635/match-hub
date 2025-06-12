package com.match_hub.backend_match_hub.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "match_teams")
public class MatchTeam {

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
