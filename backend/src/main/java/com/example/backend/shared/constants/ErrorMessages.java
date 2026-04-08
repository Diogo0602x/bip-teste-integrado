package com.example.backend.shared.constants;

public final class ErrorMessages {

    private ErrorMessages() {
    }

    public static final String BENEFICIO_NOT_FOUND = "Beneficio nao encontrado: %d";
    public static final String TRANSFER_FROM_TO_SAME = "Origem e destino devem ser diferentes.";
    public static final String TRANSFER_INSUFFICIENT_BALANCE = "Saldo insuficiente para transferencia.";
    public static final String TRANSFER_INACTIVE_BENEFICIO = "Transferencia permitida apenas entre beneficios ativos.";
    public static final String CONCURRENCY_CONFLICT = "Conflito de concorrencia detectado. Tente novamente.";
    public static final String DELETE_ONLY_INACTIVE = "Beneficio precisa estar inativo para exclusao.";
    public static final String DELETE_WITH_BALANCE = "Beneficio com saldo nao pode ser excluido. Zere o saldo antes.";
    public static final String INVALID_REQUEST = "Requisicao invalida.";
}
