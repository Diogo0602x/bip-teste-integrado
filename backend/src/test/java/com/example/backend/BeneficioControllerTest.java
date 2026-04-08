package com.example.backend;

import com.example.backend.domain.Beneficio;
import com.example.backend.repository.BeneficioRepository;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BeneficioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BeneficioRepository repository;

    private Long idOrigem;
    private Long idDestino;

    @BeforeEach
    void setupData() {
        repository.deleteAll();

        Beneficio origem = new Beneficio();
        origem.setNome("Beneficio A");
        origem.setDescricao("Descricao A");
        origem.setValor(new BigDecimal("1000.00"));
        origem.setAtivo(true);
        idOrigem = repository.save(origem).getId();

        Beneficio destino = new Beneficio();
        destino.setNome("Beneficio B");
        destino.setDescricao("Descricao B");
        destino.setValor(new BigDecimal("500.00"));
        destino.setAtivo(true);
        idDestino = repository.save(destino).getId();
    }

    @Test
    void deveListarBeneficios() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nome").value("Beneficio A"));
    }

    @Test
    void deveTransferirComPayloadValido() throws Exception {
        String payload = String.format("""
                {
                  "fromId": %d,
                  "toId": %d,
                  "amount": 50.00
                }
                """, idOrigem, idDestino);

        mockMvc.perform(post("/api/v1/beneficios/transferencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isNoContent());
    }

    @Test
    void deveObterBeneficioPorId() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/" + idOrigem))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Beneficio A"));
    }

    @Test
    void deveRetornar404QuandoIdNaoExiste() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/999999")).andExpect(status().isNotFound());
    }

    @Test
    void deveCriarBeneficio() throws Exception {
        String body =
                """
                {
                  "nome": "Novo",
                  "descricao": "D",
                  "valor": 10.00,
                  "ativo": true
                }
                """;
        mockMvc.perform(post("/api/v1/beneficios").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Novo"));
    }

    @Test
    void deveRejeitarCriacaoInvalida() throws Exception {
        String body = "{\"nome\":\"\",\"descricao\":\"\",\"valor\":-1,\"ativo\":true}";
        mockMvc.perform(post("/api/v1/beneficios").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveAtualizarBeneficio() throws Exception {
        String body =
                """
                {
                  "nome": "Atualizado",
                  "descricao": "D",
                  "valor": 100.00,
                  "ativo": true
                }
                """;
        mockMvc.perform(put("/api/v1/beneficios/" + idOrigem).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Atualizado"));
    }

    @Test
    void deveListarComFiltros() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios")
                        .param("q", "Beneficio")
                        .param("ativo", "true")
                        .param("sort", "nome")
                        .param("dir", "desc")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void deveListarComSortDesconhecidoUsandoId() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios").param("sort", "campo_invalido"))
                .andExpect(status().isOk());
    }

    @Test
    void deveExcluirBeneficioInativoComSaldoZero() throws Exception {
        Beneficio b = new Beneficio();
        b.setNome("Del");
        b.setDescricao("x");
        b.setValor(BigDecimal.ZERO);
        b.setAtivo(false);
        Long id = repository.save(b).getId();
        mockMvc.perform(delete("/api/v1/beneficios/" + id)).andExpect(status().isNoContent());
    }

    @Test
    void deveRejeitarExclusaoQuandoAtivo() throws Exception {
        mockMvc.perform(delete("/api/v1/beneficios/" + idOrigem)).andExpect(status().isUnprocessableEntity());
    }
}
