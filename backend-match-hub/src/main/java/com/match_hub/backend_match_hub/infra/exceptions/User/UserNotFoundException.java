package com.match_hub.backend_match_hub.infra.exceptions.User;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}

