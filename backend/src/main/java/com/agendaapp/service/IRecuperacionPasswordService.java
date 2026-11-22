package com.agendaapp.service;

public interface IRecuperacionPasswordService {

    void solicitar(String email);

    boolean validar(String token);

    void restablecer(String token, String password);
}
