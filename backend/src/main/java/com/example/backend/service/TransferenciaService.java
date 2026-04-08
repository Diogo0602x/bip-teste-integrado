package com.example.backend.service;

import com.example.backend.domain.Beneficio;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repository.BeneficioRepository;
import com.example.backend.shared.constants.ErrorMessages;
import com.example.backend.shared.validator.TransferenciaValidator;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransferenciaService {

    private final BeneficioRepository repository;
    private final TransferenciaValidator validator;

    public TransferenciaService(BeneficioRepository repository, TransferenciaValidator validator) {
        this.repository = repository;
        this.validator = validator;
    }

    @Transactional(rollbackFor = Exception.class)
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        validator.validateIds(fromId, toId);
        Long firstId = Math.min(fromId, toId);
        Long secondId = Math.max(fromId, toId);

        Beneficio first = lock(firstId);
        Beneficio second = lock(secondId);

        Beneficio from = fromId.equals(first.getId()) ? first : second;
        Beneficio to = toId.equals(first.getId()) ? first : second;

        validator.validateActive(from, to);
        validator.validateBalance(from, amount);

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        repository.save(from);
        repository.save(to);
    }

    private Beneficio lock(Long id) {
        return repository.findByIdForUpdate(id)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.BENEFICIO_NOT_FOUND.formatted(id)));
    }
}
