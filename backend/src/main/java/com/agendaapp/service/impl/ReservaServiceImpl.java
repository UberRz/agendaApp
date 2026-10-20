package com.agendaapp.service.impl;

import com.agendaapp.dto.request.ReservaRequest;
import com.agendaapp.dto.response.ReservaResponse;
import com.agendaapp.model.Cliente;
import com.agendaapp.model.EstadoReserva;
import com.agendaapp.model.Reserva;
import com.agendaapp.model.Servicio;
import com.agendaapp.model.Usuario;
import com.agendaapp.repository.ReservaRepository;
import com.agendaapp.repository.ServicioRepository;
import com.agendaapp.repository.UsuarioRepository;
import com.agendaapp.service.IReservaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaServiceImpl implements IReservaService {

    private final ReservaRepository reservaRepository;
    private final ServicioRepository servicioRepository;
    private final UsuarioRepository usuarioRepository;

    public ReservaServiceImpl(ReservaRepository reservaRepository,
            ServicioRepository servicioRepository,
            UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.servicioRepository = servicioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public ReservaResponse reservar(ReservaRequest request) {
        if (request == null || request.getClienteId() == null || request.getServicioId() == null) {
            throw new IllegalArgumentException("clienteId y servicioId son obligatorios");
        }

        Cliente cliente = obtenerCliente(request.getClienteId());
        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id " + request.getServicioId()));

        if (reservaRepository.existsByClienteIdAndServicioIdAndEstado(
                cliente.getId(), servicio.getId(), EstadoReserva.ACTIVA)) {
            throw new IllegalStateException("El cliente ya tiene una reserva activa para este servicio");
        }

        LocalDateTime inicio = servicio.getFechaHora();
        LocalDateTime fin = inicio.plusMinutes(servicio.getDuracion());
        boolean solapa = reservaRepository
                .findByClienteConServicio(cliente.getId(), EstadoReserva.ACTIVA)
                .stream()
                .map(Reserva::getServicio)
                .anyMatch(s -> s.getFechaHora().isBefore(fin)
                        && s.getFechaHora().plusMinutes(s.getDuracion()).isAfter(inicio));
        if (solapa) {
            throw new IllegalStateException("El cliente ya tiene una reserva activa en este horario");
        }

        long reservasActivas = reservaRepository.countByServicioIdAndEstado(
                servicio.getId(), EstadoReserva.ACTIVA);
        if (reservasActivas >= servicio.getCapacidad()) {
            throw new IllegalStateException("No hay cupos disponibles para este servicio");
        }

        return mapear(reservaRepository.save(new Reserva(cliente, servicio)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponse> listarPorCliente(Long clienteId) {
        obtenerCliente(clienteId);
        return reservaRepository.findByClienteIdOrderByServicioFechaHoraAsc(clienteId)
                .stream().map(this::mapear).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponse> listarPorProveedor(Long proveedorId) {
        Usuario proveedor = usuarioRepository.findById(proveedorId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id " + proveedorId));
        if (!(proveedor instanceof com.agendaapp.model.Proveedor)) {
            throw new IllegalArgumentException("El usuario no es un proveedor");
        }
        return reservaRepository.findByServicioProveedorIdOrderByServicioFechaHoraAsc(proveedorId)
                .stream().map(this::mapear).toList();
    }

    @Override
    @Transactional
    public ReservaResponse cancelar(Long reservaId, Long clienteId) {
        Reserva reserva = reservaRepository.findByIdAndClienteId(reservaId, clienteId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada para el cliente indicado"));
        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new IllegalStateException("La reserva ya está cancelada");
        }
        reserva.cancelar();
        return mapear(reservaRepository.save(reserva));
    }

    private Cliente obtenerCliente(Long clienteId) {
        Usuario usuario = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id " + clienteId));
        if (!(usuario instanceof Cliente cliente)) {
            throw new IllegalArgumentException("El usuario no es un cliente");
        }
        return cliente;
    }

    private ReservaResponse mapear(Reserva reserva) {
        Servicio servicio = reserva.getServicio();
        long cuposDisponibles = servicio.getCapacidad()
                - reservaRepository.countByServicioIdAndEstado(servicio.getId(), EstadoReserva.ACTIVA);
        return new ReservaResponse(
                reserva.getId(),
                reserva.getCliente().getId(),
                reserva.getCliente().getNombre(),
                servicio.getId(),
                servicio.getNombre(),
                servicio.getIdioma(),
                servicio.getNivel(),
                servicio.getFechaHora(),
                reserva.getFechaReserva(),
                reserva.getEstado(),
                Math.max(cuposDisponibles, 0),
                servicio.getProveedor().getNombre());
    }
}
