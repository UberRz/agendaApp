package com.agendaapp.service.impl;

import com.agendaapp.model.PasswordResetToken;
import com.agendaapp.model.Usuario;
import com.agendaapp.repository.PasswordResetTokenRepository;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.EmailService;
import com.agendaapp.service.IRecuperacionPasswordService;
import com.agendaapp.service.PasswordPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class RecuperacionPasswordServiceImpl implements IRecuperacionPasswordService {

    public static final String MENSAJE_TOKEN_INVALIDO = "El enlace no es válido o ya venció";

    private static final Logger log = LoggerFactory.getLogger(RecuperacionPasswordServiceImpl.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicy passwordPolicy;
    private final EmailService emailService;
    private final long minutosVigencia;
    private final String frontendUrl;

    public RecuperacionPasswordServiceImpl(UsuarioRepository usuarioRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            PasswordPolicy passwordPolicy,
            EmailService emailService,
            @Value("${app.reset.token-minutes:30}") long minutosVigencia,
            @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordPolicy = passwordPolicy;
        this.emailService = emailService;
        this.minutosVigencia = minutosVigencia;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    @Override
    @Transactional
    public void solicitar(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException("El correo electrónico no es válido");
        }
        String normalizado = email.trim().toLowerCase(Locale.ROOT);

        Optional<Usuario> encontrado = usuarioRepository.findByEmail(normalizado);
        if (encontrado.isEmpty()) {
            return; // misma respuesta al cliente: no revelamos si la cuenta existe
        }
        Usuario usuario = encontrado.get();

        tokenRepository.invalidarPendientes(usuario.getId());

        String token = generarToken();
        tokenRepository.save(new PasswordResetToken(usuario, hash(token),
                LocalDateTime.now().plusMinutes(minutosVigencia)));

        String enlace = frontendUrl + "/restablecer?token=" + token;
        try {
            emailService.enviarRecuperacion(usuario.getEmail(), usuario.getNombre(), enlace, minutosVigencia);
        } catch (RuntimeException e) {
            log.error("No se pudo enviar el correo de recuperación (usuarioId={}): {}",
                    usuario.getId(), e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validar(String token) {
        return buscarVigente(token).isPresent();
    }

    @Override
    @Transactional
    public void restablecer(String token, String password) {
        PasswordResetToken registro = buscarVigente(token)
                .orElseThrow(() -> new IllegalArgumentException(MENSAJE_TOKEN_INVALIDO));

        passwordPolicy.validar(password);

        Usuario usuario = registro.getUsuario();
        usuario.setPassword(passwordEncoder.encode(password));
        usuarioRepository.save(usuario);

        registro.marcarUsado();
        tokenRepository.save(registro);
        tokenRepository.invalidarPendientes(usuario.getId());
    }

    private Optional<PasswordResetToken> buscarVigente(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return tokenRepository.findByTokenHash(hash(token.trim()))
                .filter(t -> !t.isUsado() && t.getExpiraEn().isAfter(LocalDateTime.now()));
    }

    private String generarToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    static String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}
