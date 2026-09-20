package com.agendaapp.service;

import com.agendaapp.dto.response.UsuarioResponse;

public interface IUsuarioService {

    UsuarioResponse obtenerPorId(Long id);
}
