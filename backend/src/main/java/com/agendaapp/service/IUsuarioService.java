package com.agendaapp.service;

import com.agendaapp.dto.response.UsuarioResponse;

import java.util.List;

public interface IUsuarioService {

    UsuarioResponse obtenerPorId(Long id);

    List<UsuarioResponse> listarTodos();
}
