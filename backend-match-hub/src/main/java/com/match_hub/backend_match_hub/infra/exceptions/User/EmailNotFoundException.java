package com.match_hub.backend_match_hub.infra.exceptions.User;

public class EmailNotFoundException extends RuntimeException {
    public EmailNotFoundException(String message) {
        super(message);
    }
}
