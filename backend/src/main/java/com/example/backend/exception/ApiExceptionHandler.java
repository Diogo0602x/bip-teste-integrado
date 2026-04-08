package com.example.backend.exception;

import com.example.backend.shared.constants.ErrorMessages;
import jakarta.persistence.OptimisticLockException;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(NotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusiness(BusinessException ex) {
        return build(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
    }

    @ExceptionHandler({OptimisticLockException.class, ObjectOptimisticLockingFailureException.class})
    public ResponseEntity<ApiErrorResponse> handleConflict(Exception ex) {
        return build(HttpStatus.CONFLICT, ErrorMessages.CONCURRENCY_CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getFieldErrors().stream().findFirst()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .orElse(ErrorMessages.INVALID_REQUEST);
        return build(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new ApiErrorResponse(
                Instant.now().toString(),
                status.value(),
                status.getReasonPhrase(),
                message
        ));
    }
}
