package com.example.backend.repository;

import com.example.backend.domain.TransferenciaAuditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferenciaAuditoriaRepository extends JpaRepository<TransferenciaAuditoria, Long> {

    Page<TransferenciaAuditoria> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
