package com.agendaapp.dto.response;

public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String email;
    private String tipoUsuario;

    public UsuarioResponse(Long id, String nombre, String email, String tipoUsuario) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }
}
