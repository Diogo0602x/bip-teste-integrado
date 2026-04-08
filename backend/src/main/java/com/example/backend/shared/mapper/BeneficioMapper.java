package com.example.backend.shared.mapper;

import com.example.backend.domain.Beneficio;
import com.example.backend.dto.BeneficioRequest;
import org.springframework.stereotype.Component;

@Component
public class BeneficioMapper {

    public Beneficio toNewEntity(BeneficioRequest request) {
        Beneficio beneficio = new Beneficio();
        apply(request, beneficio);
        return beneficio;
    }

    public void apply(BeneficioRequest request, Beneficio beneficio) {
        beneficio.setNome(request.nome());
        beneficio.setDescricao(request.descricao());
        beneficio.setValor(request.valor());
        beneficio.setAtivo(request.ativo());
    }
}
