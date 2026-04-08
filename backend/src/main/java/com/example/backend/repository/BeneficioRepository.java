package com.example.backend.repository;

import com.example.backend.domain.Beneficio;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BeneficioRepository extends JpaRepository<Beneficio, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Beneficio b where b.id = :id")
    Optional<Beneficio> findByIdForUpdate(@Param("id") Long id);

    Page<Beneficio> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    Page<Beneficio> findByAtivo(Boolean ativo, Pageable pageable);

    Page<Beneficio> findByNomeContainingIgnoreCaseAndAtivo(String nome, Boolean ativo, Pageable pageable);
}
