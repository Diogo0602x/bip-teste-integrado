package com.example.backend;

import com.example.backend.domain.Beneficio;
import com.example.backend.dto.BeneficioRequest;
import com.example.backend.dto.PagedResponse;
import com.example.backend.dto.TransferenciaRequest;
import com.example.backend.dto.TransferenciaAuditoriaResponse;
import com.example.backend.service.BeneficioService;
import com.example.backend.service.TransferenciaHistoricoService;
import com.example.backend.service.TransferenciaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Benefícios", description = "Listagem paginada, CRUD e transferências entre benefícios")
@RequestMapping("/api/v1/beneficios")
public class BeneficioController {

    private final BeneficioService beneficioService;
    private final TransferenciaService transferenciaService;
    private final TransferenciaHistoricoService historicoService;

    public BeneficioController(BeneficioService beneficioService,
                                TransferenciaService transferenciaService,
                                TransferenciaHistoricoService historicoService) {
        this.beneficioService = beneficioService;
        this.transferenciaService = transferenciaService;
        this.historicoService = historicoService;
    }

    @GetMapping
    public PagedResponse<Beneficio> list(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String dir
    ) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(direction, normalizeSort(sort)));
        Page<Beneficio> result = beneficioService.list(q, ativo, pageable);
        return new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                sort,
                dir,
                q
        );
    }

    @GetMapping("/{id}")
    public Beneficio getById(@PathVariable Long id) {
        return beneficioService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Beneficio create(@Valid @RequestBody BeneficioRequest request) {
        return beneficioService.create(request);
    }

    @PutMapping("/{id}")
    public Beneficio update(@PathVariable Long id, @Valid @RequestBody BeneficioRequest request) {
        return beneficioService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        beneficioService.delete(id);
    }

    @PostMapping("/transferencias")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void transfer(@Valid @RequestBody TransferenciaRequest request) {
        transferenciaService.transfer(request.fromId(), request.toId(), request.amount());
    }

    @GetMapping("/transferencias/historico")
    public PagedResponse<TransferenciaAuditoriaResponse> historico(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return historicoService.list(page, size);
    }

    private String normalizeSort(String sort) {
        return switch (sort) {
            case "nome", "valor", "ativo", "id" -> sort;
            default -> "id";
        };
    }
}
