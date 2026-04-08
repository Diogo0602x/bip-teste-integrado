package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record TransferenciaAuditoriaResponse(
        Long id,
        Long fromId,
        Long toId,
        String fromNome,
        String toNome,
        BigDecimal amount,
        String createdAtIso,
        String status,
        String detalhe
) {}
