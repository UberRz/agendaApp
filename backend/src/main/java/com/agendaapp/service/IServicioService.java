package com.agendaapp.service;

import com.agendaapp.dto.request.ServicioRequest;
import com.agendaapp.dto.response.ServicioResponse;

import java.util.List;

public interface IServicioService {

    ServicioResponse crear(Long proveedorId, ServicioRequest request);

    ServicioResponse editar(Long servicioId, ServicioRequest request);

    List<ServicioResponse> listarTodos();

    List<ServicioResponse> listarPorProveedor(Long proveedorId);

    ServicioResponse seleccionar(Long clienteId, Long servicioId);
}
