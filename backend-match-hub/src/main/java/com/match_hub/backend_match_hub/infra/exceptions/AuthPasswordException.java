package com.match_hub.backend_match_hub.infra.exceptions;

import java.io.Serial;

public class AuthPasswordException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public AuthPasswordException(String message) {
        super(message);
    }

}
