package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.match_hub.backend_match_hub.entities.interfaces.HasProfileImage;
import com.match_hub.backend_match_hub.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "users")
@Entity
public class User implements UserDetails, Serializable, HasProfileImage {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String password;

    @Column(unique = true)
    private String email;

    private LocalDate birthDate;

    private String profilePicture;

    @Enumerated
    private UserRole role = UserRole.USER;

    @Column(name = "google_id")
    private String googleId;

    private String provider;

    private Boolean hasPassword;

    private Boolean isDarkMode = true;
    private Integer fontSize = 0;
    private Boolean librasActive = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    @Column(name = "two_factor_enabled")
    private Boolean twoFactorEnabled = false;

    @OneToMany(mappedBy = "user")
    private final List<Notification> notifications = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_favorite_games",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "game_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "game_id"})
    )
    private final List<Game> favoriteGames = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_favorite_championships",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "championship_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "championship_id"})
    )
    private final List<Championship> favoriteChampionships = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_favorite_teams",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "team_id"})
    )
    private final List<Team> favoriteTeams = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant createdAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public void setProfilePicture(String url) {
        this.profilePicture = url;
    }

    @Override
    public String getProfilePicture() {
        return profilePicture;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
