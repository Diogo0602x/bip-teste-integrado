package com.example.backend.exception;

public sealed class AppException extends RuntimeException
        permits BusinessException, NotFoundException {

    protected AppException(String message) {
        super(message);
    }
}
