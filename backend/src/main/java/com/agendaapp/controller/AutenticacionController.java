package com.agendaapp.controller;

import com.agendaapp.dto.request.LoginRequest;
import com.agendaapp.dto.request.RegistroUsuarioRequest;
import com.agendaapp.dto.response.UsuarioResponse;
import com.agendaapp.service.IAutenticacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AutenticacionController {

    private final IAutenticacionService autenticacionService;

    // Inyección por constructor (DIP) — Spring resuelve automáticamente
    // la implementación (AutenticacionServiceImpl) porque es la única
    // clase que implementa IAutenticacionService.
    public AutenticacionController(IAutenticacionService autenticacionService) {
        this.autenticacionService = autenticacionService;
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registrar(@RequestBody RegistroUsuarioRequest request) {
        UsuarioResponse response = autenticacionService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@RequestBody LoginRequest request) {
        UsuarioResponse response = autenticacionService.login(request);
        return ResponseEntity.ok(response);
    }
}
