package com.agendaapp.dto.request;

public class LoginRequest {

    private String identificador;
    private String username;
    private String email;
    private String password;

    public String getIdentificador() {
        if (identificador != null && !identificador.isBlank()) {
            return identificador;
        }
        return username != null && !username.isBlank() ? username : email;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
