package com.agendaapp.service;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class PasswordPolicy {

    public static final String MENSAJE = "La contraseña debe tener mínimo 8 caracteres y un símbolo";

    private static final Pattern SIMBOLO = Pattern.compile("[^\\w\\s]");

    public void validar(String password) {
        if (password == null || password.length() < 8 || !SIMBOLO.matcher(password).find()) {
            throw new IllegalArgumentException(MENSAJE);
        }
    }
}
