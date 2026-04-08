package com.example.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record TransferenciaRequest(
        @NotNull Long fromId,
        @NotNull Long toId,
        @NotNull @DecimalMin("0.01") BigDecimal amount
) {
}
