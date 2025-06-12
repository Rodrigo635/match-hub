package com.match_hub.backend_match_hub.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.match_hub.backend_match_hub.dtos.UserDTO;
import com.match_hub.backend_match_hub.enums.UserRole;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@NoArgsConstructor
@Table(name = "users")
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    private String password;
    @Column(unique = true)
    private String email;
    private LocalDate birthDate;
    private String profilePicture;
    @Enumerated
    private UserRole role = UserRole.USER;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Instant createdAt;

    public User(UserDTO dto){
        this.username = dto.username();
        this.password = dto.password();
        this.email = dto.email();
        this.birthDate = dto.birthDate();
        this.profilePicture = dto.profilePicture();
    }


    public String getUsername() {
        return username;
    }


    public void setUsername(String username) {
        this.username = username;
    }


    public String getPassword() {
        return password;
    }


    public void setPassword(String password) {
        this.password = password;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public LocalDate getBirthDate() {
        return birthDate;
    }


    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public UserRole getRole(){
        return role;
    }

    public void setRole(UserRole role){
        this.role = role;
    }


    public String getProfilePicture() {
        return profilePicture;
    }


    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
