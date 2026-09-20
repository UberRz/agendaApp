package com.agendaapp.dto.response;

public class ServicioResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private Integer duracion;
    private Double precio;
    private Long proveedorId;
    private String nombreProveedor;

    public ServicioResponse(Long id, String nombre, String descripcion, Integer duracion,
                             Double precio, Long proveedorId, String nombreProveedor) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.precio = precio;
        this.proveedorId = proveedorId;
        this.nombreProveedor = nombreProveedor;
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
}
