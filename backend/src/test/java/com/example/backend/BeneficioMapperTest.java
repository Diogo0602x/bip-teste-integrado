package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.backend.domain.Beneficio;
import com.example.backend.dto.BeneficioRequest;
import com.example.backend.shared.mapper.BeneficioMapper;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class BeneficioMapperTest {

    private final BeneficioMapper mapper = new BeneficioMapper();

    @Test
    void toNewEntityPreencheCampos() {
        BeneficioRequest req = new BeneficioRequest("Nome", "Desc", new BigDecimal("15.50"), true);
        Beneficio b = mapper.toNewEntity(req);
        assertEquals("Nome", b.getNome());
        assertEquals("Desc", b.getDescricao());
        assertEquals(new BigDecimal("15.50"), b.getValor());
        assertEquals(true, b.getAtivo());
    }

    @Test
    void applyAtualizaEntidadeExistente() {
        Beneficio b = new Beneficio();
        BeneficioRequest req = new BeneficioRequest("X", "Y", new BigDecimal("1.00"), false);
        mapper.apply(req, b);
        assertEquals("X", b.getNome());
        assertEquals("Y", b.getDescricao());
        assertEquals(new BigDecimal("1.00"), b.getValor());
        assertEquals(false, b.getAtivo());
    }
}
