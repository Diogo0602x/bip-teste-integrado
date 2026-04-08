package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mockStatic;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;

class BackendApplicationTest {

    @Test
    void mainDelegaParaSpringApplication() {
        try (MockedStatic<SpringApplication> spring = mockStatic(SpringApplication.class)) {
            spring.when(() -> SpringApplication.run(eq(BackendApplication.class), any(String[].class)))
                    .thenReturn(null);
            assertDoesNotThrow(() -> BackendApplication.main(new String[] {}));
            spring.verify(() -> SpringApplication.run(eq(BackendApplication.class), any(String[].class)));
        }
    }
}
