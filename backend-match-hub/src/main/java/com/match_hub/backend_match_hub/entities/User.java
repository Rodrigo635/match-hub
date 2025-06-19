package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
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
import java.util.Collection;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
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
    private boolean hasPassword;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant createdAt;

    public User(UserResponseDTO dto){
        this.id = dto.id();
        this.name = dto.name();
        this.email = dto.email();
        this.birthDate = dto.birthDate();
        this.profilePicture = dto.profilePicture();
        this.role = dto.role();
        this.provider = dto.provider();
        this.googleId = dto.googleId();
        this.hasPassword = dto.hasPassword();
    }

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
    public Long getId() {
        return this.id;
    }
}
