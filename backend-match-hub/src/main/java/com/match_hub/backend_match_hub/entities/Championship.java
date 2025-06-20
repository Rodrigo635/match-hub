package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.match_hub.backend_match_hub.entities.interfaces.HasProfileImage;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@NoArgsConstructor
@Setter
@Getter
@Table(name = "championships")
@Entity
public class Championship implements Serializable, HasProfileImage {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    private String imageChampionship;

    @OneToMany(mappedBy = "championshipId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Match> matches = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "game_id")
    @JsonIgnore
    private Game game;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant createdAt;

    @Override
    public void setProfilePicture(String url) {
        this.imageChampionship = url;
    }

    @Override
    public String toString() {
        return "Championship{" +
                "id=" + id +
                ", game=" + game +
                ", createdAt=" + createdAt +
                ", matches=" + matches +
                ", imageChampionship='" + imageChampionship + '\'' +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Championship that = (Championship) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
