package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.backend.dto.PagedResponse;
import java.util.List;
import org.junit.jupiter.api.Test;

class PagedResponseTest {

    @Test
    void recordArmazenaMetadados() {
        PagedResponse<String> p =
                new PagedResponse<>(List.of("a"), 0, 10, 1L, 1, "nome", "asc", "q");
        assertEquals(1, p.content().size());
        assertEquals(0, p.page());
        assertEquals("q", p.query());
    }
}
