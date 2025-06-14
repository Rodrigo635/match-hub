package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

@NoArgsConstructor
@Setter
@Getter
@Table(name = "games")
@Entity
public class Game implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String tournament;
    private String image;
    private String video;
    private String gif;
    private String description;

    @ElementCollection
    private List<String> tags;

    private String release;
    private String genre;
    private String developer;
    private String publisher;
    private Integer ageRating;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "championship_id")
    private Championship championshipId;

}
