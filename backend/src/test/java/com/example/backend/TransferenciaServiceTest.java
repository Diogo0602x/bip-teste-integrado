package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.backend.domain.Beneficio;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.shared.constants.ErrorMessages;
import com.example.backend.repository.BeneficioRepository;
import com.example.backend.service.TransferenciaService;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
class TransferenciaServiceTest {

    @Autowired
    private TransferenciaService transferenciaService;

    @Autowired
    private BeneficioRepository repository;

    private Long idOrigem;
    private Long idDestino;

    @BeforeEach
    void setupData() {
        repository.deleteAll();

        Beneficio origem = new Beneficio();
        origem.setNome("Origem");
        origem.setDescricao("Conta origem");
        origem.setValor(new BigDecimal("1000.00"));
        origem.setAtivo(true);
        idOrigem = repository.save(origem).getId();

        Beneficio destino = new Beneficio();
        destino.setNome("Destino");
        destino.setDescricao("Conta destino");
        destino.setValor(new BigDecimal("500.00"));
        destino.setAtivo(true);
        idDestino = repository.save(destino).getId();
    }

    @Test
    @Transactional
    void deveTransferirComSucesso() {
        transferenciaService.transfer(idOrigem, idDestino, new BigDecimal("100.00"));

        Beneficio origem = repository.findById(idOrigem).orElseThrow();
        Beneficio destino = repository.findById(idDestino).orElseThrow();

        assertEquals(new BigDecimal("900.00"), origem.getValor());
        assertEquals(new BigDecimal("600.00"), destino.getValor());
    }

    @Test
    @Transactional
    void deveFalharQuandoSaldoInsuficiente() {
        assertThrows(
                BusinessException.class,
                () -> transferenciaService.transfer(idDestino, idOrigem, new BigDecimal("9999.00"))
        );
    }

    @Test
    @Transactional
    void deveTransferirQuandoOrigemTemIdMaiorQueDestino() {
        Beneficio maior = new Beneficio();
        maior.setNome("Maior");
        maior.setDescricao("x");
        maior.setValor(new BigDecimal("200.00"));
        maior.setAtivo(true);
        Long idMaior = repository.save(maior).getId();

        Beneficio menor = new Beneficio();
        menor.setNome("Menor");
        menor.setDescricao("x");
        menor.setValor(new BigDecimal("10.00"));
        menor.setAtivo(true);
        Long idMenor = repository.save(menor).getId();

        transferenciaService.transfer(idMaior, idMenor, new BigDecimal("50.00"));

        assertEquals(new BigDecimal("150.00"), repository.findById(idMaior).orElseThrow().getValor());
        assertEquals(new BigDecimal("60.00"), repository.findById(idMenor).orElseThrow().getValor());
    }

    @Test
    @Transactional
    void deveFalharQuandoBeneficioInativo() {
        Beneficio inativo = new Beneficio();
        inativo.setNome("Ina");
        inativo.setDescricao("x");
        inativo.setValor(new BigDecimal("50.00"));
        inativo.setAtivo(false);
        Long idIna = repository.save(inativo).getId();

        BusinessException ex =
                assertThrows(BusinessException.class, () -> transferenciaService.transfer(idIna, idDestino, new BigDecimal("10.00")));
        assertEquals(ErrorMessages.TRANSFER_INACTIVE_BENEFICIO, ex.getMessage());
    }

    @Test
    @Transactional
    void deveFalharQuandoIdsIguais() {
        assertThrows(BusinessException.class, () -> transferenciaService.transfer(idOrigem, idOrigem, new BigDecimal("1.00")));
    }

    @Test
    @Transactional
    void deveFalharQuandoBeneficioNaoExiste() {
        assertThrows(
                NotFoundException.class,
                () -> transferenciaService.transfer(999_999L, idDestino, new BigDecimal("1.00")));
    }

    @Test
    @Transactional
    void deveMapearOrigemEDestinoQuandoFromIdMaiorQueToId() {
        transferenciaService.transfer(idDestino, idOrigem, new BigDecimal("10.00"));
        assertEquals(new BigDecimal("1010.00"), repository.findById(idOrigem).orElseThrow().getValor());
        assertEquals(new BigDecimal("490.00"), repository.findById(idDestino).orElseThrow().getValor());
    }
}
