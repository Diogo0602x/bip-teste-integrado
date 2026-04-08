package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.backend.domain.Beneficio;
import com.example.backend.dto.BeneficioRequest;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repository.BeneficioRepository;
import com.example.backend.service.BeneficioService;
import com.example.backend.shared.constants.ErrorMessages;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
class BeneficioServiceTest {

    @Autowired
    private BeneficioService beneficioService;

    @Autowired
    private BeneficioRepository repository;

    @BeforeEach
    void clean() {
        repository.deleteAll();
    }

    @Test
    @Transactional
    void listSemFiltrosUsaFindAll() {
        saveBeneficio("A", new BigDecimal("1.00"), true);
        var page = beneficioService.list(null, null, PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
    }

    @Test
    @Transactional
    void listComNomeEStatus() {
        saveBeneficio("Alfa", new BigDecimal("1.00"), true);
        saveBeneficio("Beta", new BigDecimal("2.00"), false);
        var page = beneficioService.list("Al", true, PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
    }

    @Test
    @Transactional
    void listApenasPorNome() {
        saveBeneficio("Gamma", new BigDecimal("1.00"), true);
        var page = beneficioService.list("Gam", null, PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
    }

    @Test
    @Transactional
    void listApenasPorStatus() {
        saveBeneficio("X", new BigDecimal("1.00"), false);
        var page = beneficioService.list(null, false, PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
    }

    @Test
    @Transactional
    void getByIdLancaQuandoNaoExiste() {
        NotFoundException ex = assertThrows(NotFoundException.class, () -> beneficioService.getById(999L));
        assertEquals(String.format(ErrorMessages.BENEFICIO_NOT_FOUND, 999L), ex.getMessage());
    }

    @Test
    @Transactional
    void createPersiste() {
        BeneficioRequest req = new BeneficioRequest("N", "D", new BigDecimal("3.00"), true);
        Beneficio b = beneficioService.create(req);
        assertEquals("N", b.getNome());
    }

    @Test
    @Transactional
    void updateAlteraRegistro() {
        Beneficio b = saveBeneficio("Old", new BigDecimal("1.00"), true);
        BeneficioRequest req = new BeneficioRequest("New", "D", new BigDecimal("2.00"), true);
        Beneficio updated = beneficioService.update(b.getId(), req);
        assertEquals("New", updated.getNome());
    }

    @Test
    @Transactional
    void deleteLancaQuandoAtivo() {
        Beneficio b = saveBeneficio("Z", new BigDecimal("0.00"), true);
        assertThrows(BusinessException.class, () -> beneficioService.delete(b.getId()));
    }

    @Test
    @Transactional
    void deleteLancaQuandoSaldoPositivo() {
        Beneficio b = saveBeneficio("Z", new BigDecimal("0.01"), false);
        assertThrows(BusinessException.class, () -> beneficioService.delete(b.getId()));
    }

    @Test
    @Transactional
    void deleteRemoveQuandoInativoESaldoZero() {
        Beneficio b = saveBeneficio("Z", BigDecimal.ZERO, false);
        beneficioService.delete(b.getId());
        assertEquals(0, repository.count());
    }

    @Test
    @Transactional
    void deleteLancaQuandoIdNaoExiste() {
        assertThrows(NotFoundException.class, () -> beneficioService.delete(999_999L));
    }

    @Test
    @Transactional
    void createInicializaVersion() {
        BeneficioRequest req = new BeneficioRequest("V", "D", new BigDecimal("1.00"), true);
        Beneficio b = beneficioService.create(req);
        assertNotNull(b.getVersion());
    }

    private Beneficio saveBeneficio(String nome, BigDecimal valor, boolean ativo) {
        Beneficio b = new Beneficio();
        b.setNome(nome);
        b.setDescricao("d");
        b.setValor(valor);
        b.setAtivo(ativo);
        return repository.save(b);
    }
}
