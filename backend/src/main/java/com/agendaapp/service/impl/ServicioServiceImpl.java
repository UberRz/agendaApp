package com.agendaapp.service.impl;

import com.agendaapp.dto.request.ServicioRequest;
import com.agendaapp.dto.response.ServicioResponse;
import com.agendaapp.model.Cliente;
import com.agendaapp.model.Proveedor;
import com.agendaapp.model.Servicio;
import com.agendaapp.model.Usuario;
import com.agendaapp.repository.ServicioRepository;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.IServicioService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioServiceImpl implements IServicioService {

    private final ServicioRepository servicioRepository;
    private final UsuarioRepository usuarioRepository;

    public ServicioServiceImpl(ServicioRepository servicioRepository,
                                UsuarioRepository usuarioRepository) {
        this.servicioRepository = servicioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public ServicioResponse crear(Long proveedorId, ServicioRequest request) {
        Proveedor proveedor = obtenerProveedor(proveedorId);

        Servicio servicio = new Servicio(
                request.getNombre(),
                request.getDescripcion(),
                request.getDuracion(),
                request.getPrecio()
        );

        proveedor.agregarServicio(servicio);
        Servicio guardado = servicioRepository.save(servicio);

        return mapearAResponse(guardado);
    }

    @Override
    public ServicioResponse editar(Long servicioId, ServicioRequest request) {
        Servicio servicio = obtenerServicio(servicioId);

        servicio.setNombre(request.getNombre());
        servicio.setDescripcion(request.getDescripcion());
        servicio.setDuracion(request.getDuracion());
        servicio.setPrecio(request.getPrecio());

        return mapearAResponse(servicioRepository.save(servicio));
    }

    @Override
    public List<ServicioResponse> listarTodos() {
        return servicioRepository.findAll()
                .stream()
                .map(this::mapearAResponse)
                .toList();
    }

    @Override
    public List<ServicioResponse> listarPorProveedor(Long proveedorId) {
        return servicioRepository.findByProveedorId(proveedorId)
                .stream()
                .map(this::mapearAResponse)
                .toList();
    }

    @Override
    public ServicioResponse seleccionar(Long clienteId, Long servicioId) {
        Usuario usuario = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id " + clienteId));

        if (!(usuario instanceof Cliente cliente)) {
            throw new RuntimeException("El usuario " + clienteId + " no es un Cliente");
        }

        Servicio servicio = obtenerServicio(servicioId);
        cliente.agregarServicioAlHistorial(servicio);
        usuarioRepository.save(cliente);

        return mapearAResponse(servicio);
    }

    private Proveedor obtenerProveedor(Long proveedorId) {
        Usuario usuario = usuarioRepository.findById(proveedorId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id " + proveedorId));

        if (!(usuario instanceof Proveedor proveedor)) {
            throw new RuntimeException("El usuario " + proveedorId + " no es un Proveedor");
        }
        return proveedor;
    }

    private Servicio obtenerServicio(Long servicioId) {
        return servicioRepository.findById(servicioId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id " + servicioId));
    }

    private ServicioResponse mapearAResponse(Servicio servicio) {
        return new ServicioResponse(
                servicio.getId(),
                servicio.getNombre(),
                servicio.getDescripcion(),
                servicio.getDuracion(),
                servicio.getPrecio(),
                servicio.getProveedor().getId(),
                servicio.getProveedor().getNombre()
        );
    }
}
