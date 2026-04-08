package com.example.backend.shared.validator;

import com.example.backend.domain.Beneficio;
import com.example.backend.exception.BusinessException;
import com.example.backend.shared.constants.ErrorMessages;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class TransferenciaValidator {

    public void validateIds(Long fromId, Long toId) {
        if (fromId.equals(toId)) {
            throw new BusinessException(ErrorMessages.TRANSFER_FROM_TO_SAME);
        }
    }

    public void validateBalance(Beneficio origem, BigDecimal amount) {
        if (origem.getValor().compareTo(amount) <= 0) {
            throw new BusinessException(ErrorMessages.TRANSFER_INSUFFICIENT_BALANCE);
        }
    }

    public void validateActive(Beneficio from, Beneficio to) {
        if (!Boolean.TRUE.equals(from.getAtivo()) || !Boolean.TRUE.equals(to.getAtivo())) {
            throw new BusinessException(ErrorMessages.TRANSFER_INACTIVE_BENEFICIO);
        }
    }
}
