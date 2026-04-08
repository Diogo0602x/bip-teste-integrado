package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.backend.domain.Beneficio;
import com.example.backend.exception.BusinessException;
import com.example.backend.shared.constants.ErrorMessages;
import com.example.backend.shared.validator.TransferenciaValidator;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class TransferenciaValidatorTest {

    private final TransferenciaValidator validator = new TransferenciaValidator();

    @Test
    void validateIdsLancaQuandoOrigemIgualDestino() {
        BusinessException ex = assertThrows(BusinessException.class, () -> validator.validateIds(1L, 1L));
        assertEquals(ErrorMessages.TRANSFER_FROM_TO_SAME, ex.getMessage());
    }

    @Test
    void validateIdsAceitaDiferentes() {
        assertDoesNotThrow(() -> validator.validateIds(1L, 2L));
    }

    @Test
    void validateBalanceLancaQuandoSaldoNaoMaiorQueValor() {
        Beneficio origem = new Beneficio();
        origem.setValor(new BigDecimal("10.00"));
        BusinessException ex =
                assertThrows(BusinessException.class, () -> validator.validateBalance(origem, new BigDecimal("10.00")));
        assertEquals(ErrorMessages.TRANSFER_INSUFFICIENT_BALANCE, ex.getMessage());
    }

    @Test
    void validateBalanceAceitaQuandoSaldoMaior() {
        Beneficio origem = new Beneficio();
        origem.setValor(new BigDecimal("10.00"));
        assertDoesNotThrow(() -> validator.validateBalance(origem, new BigDecimal("9.99")));
    }

    @Test
    void validateActiveLancaQuandoInativo() {
        Beneficio from = new Beneficio();
        from.setAtivo(false);
        Beneficio to = new Beneficio();
        to.setAtivo(true);
        assertThrows(BusinessException.class, () -> validator.validateActive(from, to));
    }

    @Test
    void validateActiveLancaQuandoApenasDestinoInativo() {
        Beneficio from = new Beneficio();
        from.setAtivo(true);
        Beneficio to = new Beneficio();
        to.setAtivo(false);
        assertThrows(BusinessException.class, () -> validator.validateActive(from, to));
    }

    @Test
    void validateActiveAceitaAmbosAtivos() {
        Beneficio from = new Beneficio();
        from.setAtivo(true);
        Beneficio to = new Beneficio();
        to.setAtivo(true);
        assertDoesNotThrow(() -> validator.validateActive(from, to));
    }
}
