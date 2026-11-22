package com.agendaapp.controller;

import com.agendaapp.dto.request.LoginRequest;
import com.agendaapp.dto.request.RecuperarPasswordRequest;
import com.agendaapp.dto.request.RegistroUsuarioRequest;
import com.agendaapp.dto.request.RestablecerPasswordRequest;
import com.agendaapp.dto.response.UsuarioResponse;
import com.agendaapp.service.IAutenticacionService;
import com.agendaapp.service.IRecuperacionPasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AutenticacionController {

    private static final String MENSAJE_SOLICITUD =
            "Si existe una cuenta asociada a ese correo, recibirás instrucciones para recuperar tu contraseña.";
    private static final String MENSAJE_RESTABLECIDO = "Tu contraseña se actualizó correctamente.";

    private final IAutenticacionService autenticacionService;
    private final IRecuperacionPasswordService recuperacionService;

    public AutenticacionController(IAutenticacionService autenticacionService,
            IRecuperacionPasswordService recuperacionService) {
        this.autenticacionService = autenticacionService;
        this.recuperacionService = recuperacionService;
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

    @PostMapping("/recuperar")
    public ResponseEntity<Map<String, String>> recuperar(@RequestBody RecuperarPasswordRequest request) {
        recuperacionService.solicitar(request.getEmail());
        return ResponseEntity.ok(Map.of("message", MENSAJE_SOLICITUD));
    }

    @GetMapping("/restablecer/validar")
    public ResponseEntity<Map<String, Boolean>> validarToken(@RequestParam("token") String token) {
        return ResponseEntity.ok(Map.of("valido", recuperacionService.validar(token)));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<Map<String, String>> restablecer(@RequestBody RestablecerPasswordRequest request) {
        recuperacionService.restablecer(request.getToken(), request.getPassword());
        return ResponseEntity.ok(Map.of("message", MENSAJE_RESTABLECIDO));
    }
}
