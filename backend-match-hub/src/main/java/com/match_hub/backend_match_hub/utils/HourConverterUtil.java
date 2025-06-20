package com.match_hub.backend_match_hub.utils;

import com.match_hub.backend_match_hub.infra.exceptions.InvalidHourFormatException;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Component
public class HourConverterUtil {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public LocalTime convert(String hourString) {
        if (hourString == null || hourString.isBlank()) {
            return null;
        }
        try {
            return LocalTime.parse(hourString, FORMATTER);
        } catch (DateTimeParseException e) {
            throw new InvalidHourFormatException("Hora inválida, formato esperado HH:mm: " + hourString);
        }
    }
}
