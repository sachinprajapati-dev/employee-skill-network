package com.sachin.employee_network.exception;

import org.neo4j.driver.exceptions.ServiceUnavailableException;
import org.neo4j.driver.exceptions.SessionExpiredException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<Map<String, Object>> handleServiceUnavailable(
            ServiceUnavailableException ex, WebRequest request) {
        return buildResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Database unavailable",
                "Could not reach the database right now. Please try again in a moment.",
                request);
    }

    @ExceptionHandler(SessionExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleSessionExpired(
            SessionExpiredException ex, WebRequest request) {
        return buildResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Database connection lost",
                "Lost connection to the database mid-request. Please try again.",
                request);
    }

    @ExceptionHandler(org.springframework.transaction.TransactionSystemException.class)
    public ResponseEntity<Map<String, Object>> handleTransactionSystemException(
            org.springframework.transaction.TransactionSystemException ex, WebRequest request) {
        return buildResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Database connection lost",
                "Lost connection to the database while processing this request. Please try again.",
                request);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccessException(
            DataAccessException ex, WebRequest request) {
        return buildResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Database error",
                "Something went wrong while talking to the database. Please try again.",
                request);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                "Not found",
                ex.getMessage(),
                request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex, WebRequest request) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected error",
                "Something went wrong on our end. Please try again.",
                request);
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status, String error, String message, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return ResponseEntity.status(status).body(body);
    }
}