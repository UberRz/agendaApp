package com.agendaapp.service.impl;

import com.agendaapp.dto.request.LoginRequest;
import com.agendaapp.dto.request.RegistroUsuarioRequest;
import com.agendaapp.dto.response.UsuarioResponse;
import com.agendaapp.model.Cliente;
import com.agendaapp.model.Proveedor;
import com.agendaapp.model.Usuario;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.IAutenticacionService;
import org.springframework.stereotype.Service;

@Service
public class AutenticacionServiceImpl implements IAutenticacionService {

    private final UsuarioRepository usuarioRepository;

    public AutenticacionServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UsuarioResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email o contraseña incorrectos"));

        if (!usuario.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        return mapearAResponse(usuario);
    }

    @Override
    public UsuarioResponse registrar(RegistroUsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un usuario registrado con ese email");
        }

        Usuario nuevoUsuario;

        if ("PROVEEDOR".equalsIgnoreCase(request.getTipoUsuario())) {
            nuevoUsuario = new Proveedor(
                    request.getNombre(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getNombreNegocio(),
                    request.getEspecialidad()
            );
        } else if ("CLIENTE".equalsIgnoreCase(request.getTipoUsuario())) {
            nuevoUsuario = new Cliente(
                    request.getNombre(),
                    request.getEmail(),
                    request.getPassword()
            );
        } else {
            throw new RuntimeException("tipoUsuario debe ser CLIENTE o PROVEEDOR");
        }

        Usuario guardado = usuarioRepository.save(nuevoUsuario);
        return mapearAResponse(guardado);
    }

    private UsuarioResponse mapearAResponse(Usuario usuario) {
        String tipo = (usuario instanceof Proveedor) ? "PROVEEDOR" : "CLIENTE";
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), tipo);
    }
}
