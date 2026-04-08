package com.example.backend.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class BeneficioEntityTest {

    @Test
    void gettersESetters() {
        Beneficio b = new Beneficio();
        b.setId(10L);
        b.setNome("N");
        b.setDescricao("D");
        b.setValor(new BigDecimal("5.55"));
        b.setAtivo(false);
        assertEquals(10L, b.getId());
        assertEquals("N", b.getNome());
        assertEquals("D", b.getDescricao());
        assertEquals(new BigDecimal("5.55"), b.getValor());
        assertEquals(false, b.getAtivo());
        assertEquals(0L, b.getVersion());
    }
}
