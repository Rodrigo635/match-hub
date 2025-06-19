package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Table(name = "matches")
@Entity
public class Match implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "championship_id")
    private Championship championship;


    @OneToMany(mappedBy = "id.match", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MatchTeam> matchTeams = new ArrayList<>();

    @Column(name = "match_hour")
    private LocalTime hour;

    private String link;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant createdAt;


}
