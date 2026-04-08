package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.example.backend.domain.Beneficio;
import com.example.backend.dto.PagedResponse;
import com.example.backend.dto.TransferenciaAuditoriaResponse;
import com.example.backend.repository.BeneficioRepository;
import com.example.backend.repository.TransferenciaAuditoriaRepository;
import com.example.backend.service.TransferenciaHistoricoService;
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
class TransferenciaHistoricoServiceTest {

    @Autowired
    private TransferenciaService transferenciaService;

    @Autowired
    private TransferenciaHistoricoService historicoService;

    @Autowired
    private BeneficioRepository beneficioRepository;

    @Autowired
    private TransferenciaAuditoriaRepository auditoriaRepository;

    private Long idOrigem;
    private Long idDestino;

    @BeforeEach
    void setup() {
        auditoriaRepository.deleteAll();
        beneficioRepository.deleteAll();

        Beneficio origem = new Beneficio();
        origem.setNome("Origem");
        origem.setDescricao("x");
        origem.setValor(new BigDecimal("1000.00"));
        origem.setAtivo(true);
        idOrigem = beneficioRepository.save(origem).getId();

        Beneficio destino = new Beneficio();
        destino.setNome("Destino");
        destino.setDescricao("x");
        destino.setValor(new BigDecimal("500.00"));
        destino.setAtivo(true);
        idDestino = beneficioRepository.save(destino).getId();
    }

    @Test
    @Transactional
    void devePersistirAuditoriaAposTransferencia() {
        transferenciaService.transfer(idOrigem, idDestino, new BigDecimal("50.00"));
        PagedResponse<TransferenciaAuditoriaResponse> page = historicoService.list(0, 10);
        assertEquals(1, page.totalElements());
        TransferenciaAuditoriaResponse r = page.content().get(0);
        assertNotNull(r.id());
        assertEquals(idOrigem, r.fromId());
        assertEquals(idDestino, r.toId());
        assertEquals("Origem", r.fromNome());
        assertEquals("Destino", r.toNome());
        assertEquals(new BigDecimal("50.00"), r.amount());
        assertEquals("SUCESSO", r.status());
        assertNotNull(r.createdAtIso());
        assertNotNull(r.detalhe());
    }

    @Test
    @Transactional
    void deveRetornarListaVaziaQuandoSemTransferencias() {
        PagedResponse<TransferenciaAuditoriaResponse> page = historicoService.list(0, 10);
        assertEquals(0, page.totalElements());
    }

    @Test
    @Transactional
    void deveRespeisarPaginacaoEOrdemDecrescente() {
        transferenciaService.transfer(idOrigem, idDestino, new BigDecimal("10.00"));
        transferenciaService.transfer(idOrigem, idDestino, new BigDecimal("20.00"));
        transferenciaService.transfer(idOrigem, idDestino, new BigDecimal("30.00"));

        PagedResponse<TransferenciaAuditoriaResponse> pag1 = historicoService.list(0, 2);
        assertEquals(3, pag1.totalElements());
        assertEquals(2, pag1.totalPages());
        assertEquals(2, pag1.content().size());

        PagedResponse<TransferenciaAuditoriaResponse> pag2 = historicoService.list(1, 2);
        assertEquals(1, pag2.content().size());
    }

    @Test
    @Transactional
    void deveNormalizarParametrosInvalidos() {
        transferenciaService.transfer(idOrigem, idDestino, new BigDecimal("10.00"));
        PagedResponse<TransferenciaAuditoriaResponse> page = historicoService.list(-1, 0);
        assertFalse(page.content().isEmpty());
    }
}
