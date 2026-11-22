package com.agendaapp.repository;

import com.agendaapp.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE PasswordResetToken t SET t.usado = true WHERE t.usuario.id = :usuarioId AND t.usado = false")
    int invalidarPendientes(@Param("usuarioId") Long usuarioId);
}
