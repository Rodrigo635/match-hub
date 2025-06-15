package com.match_hub.backend_match_hub.infra.exceptions.User;

public class TokenInvalidException extends RuntimeException{
    public TokenInvalidException(String message) {
        super(message);
    }
}
