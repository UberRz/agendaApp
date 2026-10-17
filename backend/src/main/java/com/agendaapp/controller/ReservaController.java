package com.agendaapp.controller;

import com.agendaapp.dto.request.ReservaRequest;
import com.agendaapp.dto.response.ReservaResponse;
import com.agendaapp.service.IReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final IReservaService reservaService;

    public ReservaController(IReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<ReservaResponse> reservar(@RequestBody ReservaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.reservar(request));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<ReservaResponse>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(reservaService.listarPorCliente(clienteId));
    }

    @GetMapping("/proveedor/{proveedorId}")
    public ResponseEntity<List<ReservaResponse>> listarPorProveedor(@PathVariable Long proveedorId) {
        return ResponseEntity.ok(reservaService.listarPorProveedor(proveedorId));
    }

    @DeleteMapping("/{reservaId}")
    public ResponseEntity<ReservaResponse> cancelar(@PathVariable Long reservaId,
            @RequestParam Long clienteId) {
        return ResponseEntity.ok(reservaService.cancelar(reservaId, clienteId));
    }
}