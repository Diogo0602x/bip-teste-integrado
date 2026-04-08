package com.example.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "TRANSFERENCIA_AUDITORIA")
public class TransferenciaAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FROM_ID", nullable = false)
    private Long fromId;

    @Column(name = "TO_ID", nullable = false)
    private Long toId;

    @Column(name = "FROM_NOME", nullable = false, length = 100)
    private String fromNome;

    @Column(name = "TO_NOME", nullable = false, length = 100)
    private String toNome;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "CREATED_AT", nullable = false)
    private Instant createdAt;

    @Column(nullable = false, length = 10)
    private String status;

    @Column(length = 255)
    private String detalhe;

    public Long getId() { return id; }

    public Long getFromId() { return fromId; }
    public void setFromId(Long fromId) { this.fromId = fromId; }

    public Long getToId() { return toId; }
    public void setToId(Long toId) { this.toId = toId; }

    public String getFromNome() { return fromNome; }
    public void setFromNome(String fromNome) { this.fromNome = fromNome; }

    public String getToNome() { return toNome; }
    public void setToNome(String toNome) { this.toNome = toNome; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetalhe() { return detalhe; }
    public void setDetalhe(String detalhe) { this.detalhe = detalhe; }
}
