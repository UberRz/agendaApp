package com.agendaapp.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PasswordPolicyTest {

    private final PasswordPolicy policy = new PasswordPolicy();

    @Test
    void aceptaContrasenaValida() {
        assertDoesNotThrow(() -> policy.validar("Clave#2026"));
    }

    @Test
    void rechazaMenosDeOchoCaracteres() {
        assertThrows(IllegalArgumentException.class, () -> policy.validar("Ab#1"));
    }

    @Test
    void rechazaSinSimbolo() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> policy.validar("Clave2026ok"));
        assertEquals(PasswordPolicy.MENSAJE, ex.getMessage());
    }

    @Test
    void rechazaNulo() {
        assertThrows(IllegalArgumentException.class, () -> policy.validar(null));
    }
}
