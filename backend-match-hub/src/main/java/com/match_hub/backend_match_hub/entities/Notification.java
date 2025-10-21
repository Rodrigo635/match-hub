package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.match_hub.backend_match_hub.entities.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "match_id", nullable = false)
    private Long matchId;

    @ElementCollection
    @CollectionTable(name = "notification_teams", joinColumns = @JoinColumn(name = "notification_id"))
    @Column(name = "team_name")
    private List<String> teams;

    @Column(name = "tournament_name", length = 255)
    private String tounamentName;

    @Column(name = "game_name")
    private String gameName;

    @Column(name = "championship_name", length = 255)
    private String championshipName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(nullable = false)
    private boolean read = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

}