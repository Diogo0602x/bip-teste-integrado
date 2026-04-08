package com.example.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BeneficioRequest(
        @NotBlank String nome,
        String descricao,
        @NotNull @DecimalMin("0.00") BigDecimal valor,
        @NotNull Boolean ativo
) {
}
