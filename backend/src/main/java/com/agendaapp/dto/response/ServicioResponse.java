package com.agendaapp.dto.response;

import java.time.LocalDateTime;

public class ServicioResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private Integer duracion;
    private Double precio;
    private Long proveedorId;
    private String nombreProveedor;
    private String idioma;
    private String nivel;
    private LocalDateTime fechaHora;
    private Integer capacidad;
    private long cuposDisponibles;

    public ServicioResponse(Long id, String nombre, String descripcion, Integer duracion,
            Double precio, Long proveedorId, String nombreProveedor,
            String idioma, String nivel, LocalDateTime fechaHora,
            Integer capacidad, long cuposDisponibles) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.precio = precio;
        this.proveedorId = proveedorId;
        this.nombreProveedor = nombreProveedor;
        this.idioma = idioma;
        this.nivel = nivel;
        this.fechaHora = fechaHora;
        this.capacidad = capacidad;
        this.cuposDisponibles = cuposDisponibles;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getDuracion() {
        return duracion;
    }

    public Double getPrecio() {
        return precio;
    }

    public Long getProveedorId() {
        return proveedorId;
    }

    public String getNombreProveedor() {
        return nombreProveedor;
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

    public Integer getCapacidad() {
        return capacidad;
    }

    public long getCuposDisponibles() {
        return cuposDisponibles;
    }
}
