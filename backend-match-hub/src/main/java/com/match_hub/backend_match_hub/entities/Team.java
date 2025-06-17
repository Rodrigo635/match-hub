package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Table(name = "teams")
@Entity
public class Team implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "id.team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MatchTeam> matchTeams = new ArrayList<>();

    private String name;
    private String logo;
    private Date createdAt = new Date(System.currentTimeMillis());

}
