package com.agendaapp.dto.response;

import com.agendaapp.model.EstadoReserva;
import java.time.LocalDateTime;

public class ReservaResponse {

    private final Long id;
    private final Long clienteId;
    private final String nombreCliente;
    private final Long servicioId;
    private final String nombreServicio;
    private final String idioma;
    private final String nivel;
    private final LocalDateTime fechaHora;
    private final LocalDateTime fechaReserva;
    private final EstadoReserva estado;
    private final long cuposDisponibles;
    private final String nombreProveedor;

    public ReservaResponse(Long id, Long clienteId, String nombreCliente, Long servicioId,
            String nombreServicio, String idioma, String nivel,
            LocalDateTime fechaHora, LocalDateTime fechaReserva,
            EstadoReserva estado, long cuposDisponibles, String nombreProveedor) {
        this.id = id;
        this.clienteId = clienteId;
        this.nombreCliente = nombreCliente;
        this.servicioId = servicioId;
        this.nombreServicio = nombreServicio;
        this.idioma = idioma;
        this.nivel = nivel;
        this.fechaHora = fechaHora;
        this.fechaReserva = fechaReserva;
        this.estado = estado;
        this.cuposDisponibles = cuposDisponibles;
        this.nombreProveedor = nombreProveedor;
    }

    public Long getId() {
        return id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public String getIdioma() {
        return idioma;
    }

    public String getNivel() {
        return nivel;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }

    public EstadoReserva getEstado() {
        return estado;
    }

    public long getCuposDisponibles() {
        return cuposDisponibles;
    }

    public String getNombreProveedor() {
        return nombreProveedor;
    }
}
