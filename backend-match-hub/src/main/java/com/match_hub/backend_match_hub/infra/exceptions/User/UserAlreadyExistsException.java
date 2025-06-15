package com.match_hub.backend_match_hub.infra.exceptions.User;

public class UserAlreadyExistsException extends RuntimeException{
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
