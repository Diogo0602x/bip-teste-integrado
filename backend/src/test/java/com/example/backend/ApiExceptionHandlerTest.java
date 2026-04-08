package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.example.backend.exception.ApiErrorResponse;
import com.example.backend.exception.ApiExceptionHandler;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.shared.constants.ErrorMessages;
import jakarta.persistence.OptimisticLockException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.WebDataBinder;

class ApiExceptionHandlerTest {

    private final ApiExceptionHandler handler = new ApiExceptionHandler();

    @Test
    void handleNotFoundRetorna404() {
        ResponseEntity<ApiErrorResponse> r = handler.handleNotFound(new NotFoundException("x"));
        assertEquals(HttpStatus.NOT_FOUND, r.getStatusCode());
        assertEquals("x", r.getBody().message());
    }

    @Test
    void handleBusinessRetorna422() {
        ResponseEntity<ApiErrorResponse> r = handler.handleBusiness(new BusinessException("regra"));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, r.getStatusCode());
        assertEquals("regra", r.getBody().message());
    }

    @Test
    void handleConflictComOptimisticLockException() {
        ResponseEntity<ApiErrorResponse> r =
                handler.handleConflict(new OptimisticLockException("c"));
        assertEquals(HttpStatus.CONFLICT, r.getStatusCode());
        assertEquals(ErrorMessages.CONCURRENCY_CONFLICT, r.getBody().message());
    }

    @Test
    void handleConflictComObjectOptimisticLockingFailureException() {
        ResponseEntity<ApiErrorResponse> r =
                handler.handleConflict(new ObjectOptimisticLockingFailureException(Object.class, "id"));
        assertEquals(HttpStatus.CONFLICT, r.getStatusCode());
    }

    @Test
    void handleValidationComErrosDeCampo() throws NoSuchMethodException {
        WebDataBinder binder = new WebDataBinder(new Object());
        BeanPropertyBindingResult errors = (BeanPropertyBindingResult) binder.getBindingResult();
        errors.addError(new FieldError("obj", "campo", "mensagem"));
        var method = ApiExceptionHandlerTest.class.getDeclaredMethod("dummy", String.class);
        var parameter = new org.springframework.core.MethodParameter(method, 0);
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(parameter, errors);
        ResponseEntity<ApiErrorResponse> r = handler.handleValidation(ex);
        assertEquals(HttpStatus.BAD_REQUEST, r.getStatusCode());
        assertTrue(r.getBody().message().contains("campo"));
    }

    @Test
    void handleValidationSemFieldErrorsUsaPadrao() throws NoSuchMethodException {
        WebDataBinder binder = new WebDataBinder(new Object());
        BeanPropertyBindingResult errors = (BeanPropertyBindingResult) binder.getBindingResult();
        var method = ApiExceptionHandlerTest.class.getDeclaredMethod("dummy", String.class);
        var parameter = new org.springframework.core.MethodParameter(method, 0);
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(parameter, errors);
        ResponseEntity<ApiErrorResponse> r = handler.handleValidation(ex);
        assertEquals(HttpStatus.BAD_REQUEST, r.getStatusCode());
        assertEquals(ErrorMessages.INVALID_REQUEST, r.getBody().message());
    }

    @SuppressWarnings("unused")
    private void dummy(String x) {}
}
