package com.agendaapp.service.impl;

import com.agendaapp.dto.response.UsuarioResponse;
import com.agendaapp.model.Proveedor;
import com.agendaapp.model.Usuario;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.IUsuarioService;
import org.springframework.stereotype.Service;

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
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), tipo);
    }
}
