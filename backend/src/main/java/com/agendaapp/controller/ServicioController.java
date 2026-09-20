package com.agendaapp.controller;

import com.agendaapp.dto.request.ServicioRequest;
import com.agendaapp.dto.response.ServicioResponse;
import com.agendaapp.service.IServicioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final IServicioService servicioService;

    public ServicioController(IServicioService servicioService) {
        this.servicioService = servicioService;
    }

    // POST /api/servicios?proveedorId=1
    @PostMapping
    public ResponseEntity<ServicioResponse> crear(@RequestParam Long proveedorId,
                                                    @RequestBody ServicioRequest request) {
        ServicioResponse response = servicioService.crear(proveedorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/servicios/5
    @PutMapping("/{servicioId}")
    public ResponseEntity<ServicioResponse> editar(@PathVariable Long servicioId,
                                                     @RequestBody ServicioRequest request) {
        ServicioResponse response = servicioService.editar(servicioId, request);
        return ResponseEntity.ok(response);
    }

    // GET /api/servicios
    @GetMapping
    public ResponseEntity<List<ServicioResponse>> listarTodos() {
        return ResponseEntity.ok(servicioService.listarTodos());
    }

    // GET /api/servicios/proveedor/1
    @GetMapping("/proveedor/{proveedorId}")
    public ResponseEntity<List<ServicioResponse>> listarPorProveedor(@PathVariable Long proveedorId) {
        return ResponseEntity.ok(servicioService.listarPorProveedor(proveedorId));
    }

    // POST /api/servicios/5/seleccionar?clienteId=2
    @PostMapping("/{servicioId}/seleccionar")
    public ResponseEntity<ServicioResponse> seleccionar(@PathVariable Long servicioId,
                                                          @RequestParam Long clienteId) {
        ServicioResponse response = servicioService.seleccionar(clienteId, servicioId);
        return ResponseEntity.ok(response);
    }
}
