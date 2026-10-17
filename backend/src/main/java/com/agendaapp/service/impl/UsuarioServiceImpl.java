package com.agendaapp.service.impl;

import com.agendaapp.dto.response.UsuarioResponse;
import com.agendaapp.model.Proveedor;
import com.agendaapp.model.Usuario;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.IUsuarioService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UsuarioResponse obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id " + id));

        String tipo = (usuario instanceof Proveedor) ? "PROVEEDOR" : "CLIENTE";
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(),
                usuario.getUsername(), usuario.getTelefono(), tipo);
    }

    @Override
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::mapearAResponse)
                .toList();
    }

    private UsuarioResponse mapearAResponse(Usuario usuario) {
        String tipo = (usuario instanceof Proveedor) ? "PROVEEDOR" : "CLIENTE";
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(),
                usuario.getUsername(), usuario.getTelefono(), tipo);
    }
}
