package com.example.backend.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.time.Instant;
import org.junit.jupiter.api.Test;

class TransferenciaAuditoriaEntityTest {

    @Test
    void gettersESetters() {
        TransferenciaAuditoria a = new TransferenciaAuditoria();
        Instant now = Instant.now();

        a.setFromId(1L);
        a.setToId(2L);
        a.setFromNome("Origem");
        a.setToNome("Destino");
        a.setAmount(new BigDecimal("100.00"));
        a.setCreatedAt(now);
        a.setStatus("SUCESSO");
        a.setDetalhe("ok");

        assertEquals(1L, a.getFromId());
        assertEquals(2L, a.getToId());
        assertEquals("Origem", a.getFromNome());
        assertEquals("Destino", a.getToNome());
        assertEquals(new BigDecimal("100.00"), a.getAmount());
        assertEquals(now, a.getCreatedAt());
        assertEquals("SUCESSO", a.getStatus());
        assertEquals("ok", a.getDetalhe());
    }
}
