package com.agendaapp.controller;

import com.agendaapp.dto.response.UsuarioResponse;
import com.agendaapp.service.IUsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    public UsuarioController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable Long id) {
        UsuarioResponse response = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(response);
    }
}
