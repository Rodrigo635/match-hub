package com.match_hub.backend_match_hub.infra.exceptions;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.match_hub.backend_match_hub.services.exceptions.ObjectAlreadyExistsException;
import com.match_hub.backend_match_hub.services.exceptions.ObjectNotAvailableException;
import com.match_hub.backend_match_hub.services.exceptions.ObjectNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class ResourceExceptionHandler {

    @ExceptionHandler(ObjectNotFoundException.class)
    public ResponseEntity<StandardError> handleObjectNotFoundException(ObjectNotFoundException e, HttpServletRequest request) {
        return handleException("Object not found", HttpStatus.NOT_FOUND, e, request);
    }

    @ExceptionHandler(ObjectNotAvailableException.class)
    public ResponseEntity<StandardError> handleObjectNotAvailableException(ObjectNotAvailableException e, HttpServletRequest request) {
        return handleException("Object not available", HttpStatus.CONFLICT, e, request);
    }


    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<StandardError> handleJWTVerificationException(JWTVerificationException e, HttpServletRequest request) {
        return handleException("JWT Verification Exception", HttpStatus.BAD_REQUEST, e, request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardError> handleDataIntegrityViolationException(DataIntegrityViolationException e, HttpServletRequest request) {
        return handleException("Cannot delete object because it is associated with existing object", HttpStatus.CONFLICT, e, request);
    }

    @ExceptionHandler(ObjectAlreadyExistsException.class)
    public ResponseEntity<StandardError> handleProductAlreadyExistsException(ObjectAlreadyExistsException e, HttpServletRequest request) {
        return handleException("Object Already Exists", HttpStatus.CONFLICT, e, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardError> handleMethodNotValidException(MethodArgumentNotValidException e, HttpServletRequest request) {
        List<String> errors = e.getBindingResult().getAllErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());
        String errorMessage = String.join(", ", errors);
        return handleException("Argument Not Valid", HttpStatus.BAD_REQUEST, new IllegalArgumentException(errorMessage), request);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<StandardError> handleInvalidDataAccessApiUsageException(InvalidDataAccessApiUsageException e, HttpServletRequest request) {
        return handleException("Argument Not Valid", HttpStatus.BAD_REQUEST, e, request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<StandardError> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        return handleException("Argument Not Valid", HttpStatus.BAD_REQUEST, e, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<StandardError> handleHttpMessageNotReadableException(HttpMessageNotReadableException e, HttpServletRequest request) {
        return handleException("Argument Not Valid", HttpStatus.BAD_REQUEST, e, request);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<StandardError> handleNoResourceFoundException(NoResourceFoundException e, HttpServletRequest request) {
        return handleException("Invalid Url", HttpStatus.BAD_REQUEST, e, request);
    }

    private ResponseEntity<StandardError> handleException(String error, HttpStatus status, Exception e, HttpServletRequest request) {
        StandardError err = new StandardError(Instant.now(), status.value(), error, e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

}
