package com.match_hub.backend_match_hub.infra.exceptions;

import java.io.Serial;

public class InvalidHourFormatException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public InvalidHourFormatException(String message) {
        super(message);
    }
}
