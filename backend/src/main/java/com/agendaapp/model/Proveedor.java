package com.agendaapp.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("PROVEEDOR")
public class Proveedor extends Usuario {

    private String nombreNegocio;
    private String especialidad;

    @OneToMany(mappedBy = "proveedor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Servicio> servicios = new ArrayList<>();

    protected Proveedor() {
        // constructor vacío requerido por JPA
    }

    public Proveedor(String nombre, String email, String username, String telefono, String password,
            String nombreNegocio, String especialidad) {
        super(nombre, email, username, telefono, password);
        this.nombreNegocio = nombreNegocio;
        this.especialidad = especialidad;
    }

    public String getNombreNegocio() {
        return nombreNegocio;
    }

    public void setNombreNegocio(String nombreNegocio) {
        this.nombreNegocio = nombreNegocio;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public List<Servicio> getServicios() {
        return servicios;
    }

    public void agregarServicio(Servicio servicio) {
        servicio.setProveedor(this);
        this.servicios.add(servicio);
    }
}
