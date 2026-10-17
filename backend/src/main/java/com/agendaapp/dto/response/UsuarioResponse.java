package com.agendaapp.dto.response;

public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String email;
    private String username;
    private String telefono;
    private String tipoUsuario;

    public UsuarioResponse(Long id, String nombre, String email, String username,
            String telefono, String tipoUsuario) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.username = username;
        this.telefono = telefono;
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

    public String getUsername() {
        return username;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }
}
