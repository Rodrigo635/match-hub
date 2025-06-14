package com.match_hub.backend_match_hub.services.exceptions;

import java.io.Serial;

public class ObjectNotAvailableException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ObjectNotAvailableException(String message) {
        super(message);
    }

}
