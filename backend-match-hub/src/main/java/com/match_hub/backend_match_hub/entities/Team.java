package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.match_hub.backend_match_hub.entities.interfaces.HasProfileImage;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Table(name = "teams")
@Entity
public class Team implements Serializable, HasProfileImage {

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

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant createdAt;

    @Override
    public void setProfilePicture(String url) {
        this.logo = url;
    }
}
