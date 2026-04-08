package com.example.backend.exception;

public record ApiErrorResponse(
        String timestamp,
        int status,
        String error,
        String message
) {}
