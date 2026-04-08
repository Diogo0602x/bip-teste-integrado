package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.example.backend.shared.constants.ErrorMessages;
import java.lang.reflect.Constructor;
import org.junit.jupiter.api.Test;

class ErrorMessagesTest {

    @Test
    void construtorPrivadoExiste() throws Exception {
        Constructor<ErrorMessages> ctor = ErrorMessages.class.getDeclaredConstructor();
        ctor.setAccessible(true);
        ErrorMessages instance = ctor.newInstance();
        assertTrue(instance instanceof ErrorMessages);
    }
}
