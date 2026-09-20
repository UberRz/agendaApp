package com.agendaapp.service;

import com.agendaapp.dto.request.LoginRequest;
import com.agendaapp.dto.request.RegistroUsuarioRequest;
import com.agendaapp.dto.response.UsuarioResponse;

public interface IAutenticacionService {

    UsuarioResponse login(LoginRequest request);

    UsuarioResponse registrar(RegistroUsuarioRequest request);
}
