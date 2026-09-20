package com.agendaapp.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("CLIENTE")
public class Cliente extends Usuario {

    @ManyToMany
    @JoinTable(
            name = "cliente_historial_servicio",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private List<Servicio> historialServicios = new ArrayList<>();

    protected Cliente() {
        // constructor vacío requerido por JPA
    }

    public Cliente(String nombre, String email, String password) {
        super(nombre, email, password);
    }

    public List<Servicio> getHistorialServicios() {
        return historialServicios;
    }

    public void agregarServicioAlHistorial(Servicio servicio) {
        this.historialServicios.add(servicio);
    }
}
