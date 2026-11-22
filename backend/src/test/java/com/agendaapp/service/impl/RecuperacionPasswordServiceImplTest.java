package com.agendaapp.service.impl;

import com.agendaapp.model.Cliente;
import com.agendaapp.model.PasswordResetToken;
import com.agendaapp.repository.PasswordResetTokenRepository;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.EmailService;
import com.agendaapp.service.PasswordPolicy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class RecuperacionPasswordServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private PasswordResetTokenRepository tokenRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private EmailService emailService;

    private RecuperacionPasswordServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new RecuperacionPasswordServiceImpl(usuarioRepository, tokenRepository, passwordEncoder,
                new PasswordPolicy(), emailService, 30, "http://localhost:3000/");
    }

    private Cliente usuario() {
        return new Cliente("Ana", "ana@correo.com", "ana", "3000000", "HASH_VIEJO");
    }

    private PasswordResetToken tokenVigente(Cliente usuario, String token) {
        PasswordResetToken registro = new PasswordResetToken(usuario,
                RecuperacionPasswordServiceImpl.hash(token), LocalDateTime.now().plusMinutes(10));
        when(tokenRepository.findByTokenHash(RecuperacionPasswordServiceImpl.hash(token)))
                .thenReturn(Optional.of(registro));
        return registro;
    }

    @Test
    void solicitarConCuentaExistenteGuardaHashYEnviaCorreo() {
        when(usuarioRepository.findByEmail("ana@correo.com")).thenReturn(Optional.of(usuario()));

        service.solicitar("  Ana@Correo.com ");

        ArgumentCaptor<PasswordResetToken> guardado = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(tokenRepository).save(guardado.capture());
        ArgumentCaptor<String> enlace = ArgumentCaptor.forClass(String.class);
        verify(emailService).enviarRecuperacion(eq("ana@correo.com"), eq("Ana"), enlace.capture(), eq(30L));

        String prefijo = "http://localhost:3000/restablecer?token=";
        assertTrue(enlace.getValue().startsWith(prefijo));
        String token = enlace.getValue().substring(prefijo.length());
        assertFalse(token.isBlank());
        assertNotEquals(token, guardado.getValue().getTokenHash());
        assertEquals(RecuperacionPasswordServiceImpl.hash(token), guardado.getValue().getTokenHash());
    }

    @Test
    void solicitarConCuentaInexistenteNoEnviaNiGuardaNiLanza() {
        when(usuarioRepository.findByEmail("nadie@correo.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> service.solicitar("nadie@correo.com"));

        verify(emailService, never()).enviarRecuperacion(any(), any(), any(), anyLong());
        verify(tokenRepository, never()).save(any());
    }

    @Test
    void solicitarConCorreoInvalidoLanza() {
        assertThrows(IllegalArgumentException.class, () -> service.solicitar("no-es-correo"));
        assertThrows(IllegalArgumentException.class, () -> service.solicitar(null));
    }

    @Test
    void solicitarNoFallaSiElEnvioDeCorreoFalla() {
        when(usuarioRepository.findByEmail("ana@correo.com")).thenReturn(Optional.of(usuario()));
        doThrow(new RuntimeException("smtp caído")).when(emailService)
                .enviarRecuperacion(any(), any(), any(), anyLong());

        assertDoesNotThrow(() -> service.solicitar("ana@correo.com"));
    }

    @Test
    void restablecerConTokenInexistenteLanza() {
        when(tokenRepository.findByTokenHash(any())).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.restablecer("tok123", "Nueva#2026"));
        assertEquals(RecuperacionPasswordServiceImpl.MENSAJE_TOKEN_INVALIDO, ex.getMessage());
    }

    @Test
    void restablecerConTokenVencidoLanza() {
        PasswordResetToken vencido = new PasswordResetToken(usuario(),
                RecuperacionPasswordServiceImpl.hash("tok123"), LocalDateTime.now().minusMinutes(1));
        when(tokenRepository.findByTokenHash(RecuperacionPasswordServiceImpl.hash("tok123")))
                .thenReturn(Optional.of(vencido));

        assertThrows(IllegalArgumentException.class, () -> service.restablecer("tok123", "Nueva#2026"));
    }

    @Test
    void restablecerConTokenUsadoLanza() {
        PasswordResetToken registro = tokenVigente(usuario(), "tok123");
        registro.marcarUsado();

        assertThrows(IllegalArgumentException.class, () -> service.restablecer("tok123", "Nueva#2026"));
    }

    @Test
    void restablecerExitosoCambiaPasswordYMarcaUsado() {
        Cliente u = usuario();
        PasswordResetToken registro = tokenVigente(u, "tok123");
        when(passwordEncoder.encode("Nueva#2026")).thenReturn("HASH_NUEVO");

        service.restablecer("tok123", "Nueva#2026");

        assertEquals("HASH_NUEVO", u.getPassword());
        assertTrue(registro.isUsado());
        verify(usuarioRepository).save(u);
    }

    @Test
    void restablecerConPasswordDebilLanzaYNoConsumeElToken() {
        Cliente u = usuario();
        PasswordResetToken registro = tokenVigente(u, "tok123");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.restablecer("tok123", "corta"));

        assertEquals(PasswordPolicy.MENSAJE, ex.getMessage());
        assertFalse(registro.isUsado());
        assertEquals("HASH_VIEJO", u.getPassword());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void validarDevuelveTrueSoloParaTokenVigente() {
        tokenVigente(usuario(), "tok123");
        when(tokenRepository.findByTokenHash(RecuperacionPasswordServiceImpl.hash("otro")))
                .thenReturn(Optional.empty());

        assertTrue(service.validar("tok123"));
        assertFalse(service.validar("otro"));
        assertFalse(service.validar(null));
        assertFalse(service.validar("  "));
    }
}
