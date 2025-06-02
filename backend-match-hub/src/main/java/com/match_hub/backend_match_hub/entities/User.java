package com.match_hub.backend_match_hub.entities;

import com.match_hub.backend_match_hub.dtos.UserDTO;

public class User {

    private String username;
    private String password;
    private String email;
    private String profilePicture;

    public User(){

    }

    public User(UserDTO dto){
        this.username = dto.username();
        this.password = dto.password();
        this.email = dto.email();
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

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
