package com.agendaapp.service.impl;

import com.agendaapp.dto.request.LoginRequest;
import com.agendaapp.dto.request.RegistroUsuarioRequest;
import com.agendaapp.dto.response.UsuarioResponse;
import com.agendaapp.model.Cliente;
import com.agendaapp.model.Proveedor;
import com.agendaapp.model.Usuario;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.IAutenticacionService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class AutenticacionServiceImpl implements IAutenticacionService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_SYMBOL_PATTERN = Pattern.compile(".*[^\\w\\s].*");

    public AutenticacionServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UsuarioResponse login(LoginRequest request) {
        String identificador = request.getIdentificador();
        if (identificador == null || identificador.isBlank() || request.getPassword() == null) {
            throw new IllegalArgumentException("Usuario y contraseña son obligatorios");
        }

        Usuario usuario = usuarioRepository.findByUsernameOrEmail(
                identificador.trim().toLowerCase(Locale.ROOT),
                identificador.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new RuntimeException("Email o contraseña incorrectos"));

        boolean passwordMatches = usuario.getPassword() != null
                && (esPasswordCifrada(usuario.getPassword())
                        ? passwordEncoder.matches(request.getPassword(), usuario.getPassword())
                        : usuario.getPassword().equals(request.getPassword()));
        if (!passwordMatches) {
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        if (!esPasswordCifrada(usuario.getPassword())) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            usuarioRepository.save(usuario);
        }

        return mapearAResponse(usuario);
    }

    @Override
    public UsuarioResponse registrar(RegistroUsuarioRequest request) {
        validarRegistro(request);

        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String username = request.getUsername().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("Ya existe un usuario registrado con ese email");
        }
        if (usuarioRepository.existsByUsername(username)) {
            throw new RuntimeException("Ya existe un usuario registrado con ese nombre de usuario");
        }

        String password = passwordEncoder.encode(request.getPassword());

        Usuario nuevoUsuario;

        if ("PROVEEDOR".equalsIgnoreCase(request.getTipoUsuario())) {
            nuevoUsuario = new Proveedor(
                    request.getNombre(),
                    email,
                    username,
                    request.getTelefono().trim(),
                    password,
                    request.getNombreNegocio(),
                    request.getEspecialidad());
        } else if ("CLIENTE".equalsIgnoreCase(request.getTipoUsuario())) {
            nuevoUsuario = new Cliente(
                    request.getNombre(),
                    email,
                    username,
                    request.getTelefono().trim(),
                    password);
        } else {
            throw new RuntimeException("tipoUsuario debe ser CLIENTE o PROVEEDOR");
        }

        Usuario guardado = usuarioRepository.save(nuevoUsuario);
        return mapearAResponse(guardado);
    }

    private UsuarioResponse mapearAResponse(Usuario usuario) {
        String tipo = (usuario instanceof Proveedor) ? "PROVEEDOR" : "CLIENTE";
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(),
                usuario.getUsername(), usuario.getTelefono(), tipo);
    }

    private void validarRegistro(RegistroUsuarioRequest request) {
        if (request == null || esVacio(request.getNombre()) || esVacio(request.getEmail())
                || esVacio(request.getUsername()) || esVacio(request.getTelefono())
                || esVacio(request.getPassword()) || esVacio(request.getTipoUsuario())) {
            throw new IllegalArgumentException(
                    "Nombre, correo, usuario, teléfono, contraseña y tipo de usuario son obligatorios");
        }
        if (!EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
            throw new IllegalArgumentException("El correo electrónico no es válido");
        }
        if (request.getPassword().length() < 8 || !PASSWORD_SYMBOL_PATTERN.matcher(request.getPassword()).matches()) {
            throw new IllegalArgumentException("La contraseña debe tener mínimo 8 caracteres y un símbolo");
        }
        if (!"CLIENTE".equalsIgnoreCase(request.getTipoUsuario())
                && !"PROVEEDOR".equalsIgnoreCase(request.getTipoUsuario())) {
            throw new IllegalArgumentException("tipoUsuario debe ser CLIENTE o PROVEEDOR");
        }
    }

    private boolean esVacio(String value) {
        return value == null || value.isBlank();
    }

    private boolean esPasswordCifrada(String password) {
        return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
    }
}
