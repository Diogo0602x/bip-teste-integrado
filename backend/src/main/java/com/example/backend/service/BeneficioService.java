package com.example.backend.service;

import com.example.backend.domain.Beneficio;
import com.example.backend.dto.BeneficioRequest;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repository.BeneficioRepository;
import com.example.backend.shared.constants.ErrorMessages;
import com.example.backend.shared.mapper.BeneficioMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class BeneficioService {

    private final BeneficioRepository repository;
    private final BeneficioMapper mapper;

    public BeneficioService(BeneficioRepository repository, BeneficioMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<Beneficio> list(String query, Boolean ativo, Pageable pageable) {
        boolean hasQuery = query != null && !query.isBlank();
        boolean hasStatus = ativo != null;

        if (!hasQuery && !hasStatus) {
            return repository.findAll(pageable);
        }
        if (hasQuery && hasStatus) {
            return repository.findByNomeContainingIgnoreCaseAndAtivo(query.trim(), ativo, pageable);
        }
        if (hasQuery) {
            return repository.findByNomeContainingIgnoreCase(query.trim(), pageable);
        }
        return repository.findByAtivo(ativo, pageable);
    }

    @Transactional(readOnly = true)
    public Beneficio getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.BENEFICIO_NOT_FOUND.formatted(id)));
    }

    @Transactional
    public Beneficio create(BeneficioRequest request) {
        Beneficio beneficio = mapper.toNewEntity(request);
        return repository.save(beneficio);
    }

    @Transactional
    public Beneficio update(Long id, BeneficioRequest request) {
        Beneficio beneficio = getById(id);
        mapper.apply(request, beneficio);
        return repository.save(beneficio);
    }

    @Transactional
    public void delete(Long id) {
        Beneficio beneficio = repository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.BENEFICIO_NOT_FOUND.formatted(id)));
        if (Boolean.TRUE.equals(beneficio.getAtivo())) {
            throw new BusinessException(ErrorMessages.DELETE_ONLY_INACTIVE);
        }
        if (beneficio.getValor().compareTo(BigDecimal.ZERO) > 0) {
            throw new BusinessException(ErrorMessages.DELETE_WITH_BALANCE);
        }
        repository.deleteById(id);
    }
}
