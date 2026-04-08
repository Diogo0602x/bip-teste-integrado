package com.example.backend.service;

import com.example.backend.domain.TransferenciaAuditoria;
import com.example.backend.dto.PagedResponse;
import com.example.backend.dto.TransferenciaAuditoriaResponse;
import com.example.backend.repository.TransferenciaAuditoriaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransferenciaHistoricoService {

    private final TransferenciaAuditoriaRepository repository;

    public TransferenciaHistoricoService(TransferenciaAuditoriaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<TransferenciaAuditoriaResponse> list(int page, int size) {
        Page<TransferenciaAuditoria> result =
                repository.findAllByOrderByCreatedAtDesc(PageRequest.of(Math.max(page, 0), Math.max(size, 1)));
        return new PagedResponse<>(
                result.getContent().stream().map(this::toResponse).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                "createdAt",
                "desc",
                null
        );
    }

    private TransferenciaAuditoriaResponse toResponse(TransferenciaAuditoria a) {
        return new TransferenciaAuditoriaResponse(
                a.getId(),
                a.getFromId(),
                a.getToId(),
                a.getFromNome(),
                a.getToNome(),
                a.getAmount(),
                a.getCreatedAt().toString(),
                a.getStatus(),
                a.getDetalhe()
        );
    }
}
