package com.agendaapp.service;

import com.agendaapp.dto.request.ReservaRequest;
import com.agendaapp.dto.response.ReservaResponse;

import java.util.List;

public interface IReservaService {

    ReservaResponse reservar(ReservaRequest request);

    List<ReservaResponse> listarPorCliente(Long clienteId);

    List<ReservaResponse> listarPorProveedor(Long proveedorId);

    ReservaResponse cancelar(Long reservaId, Long clienteId);
}