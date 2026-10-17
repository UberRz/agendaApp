package com.agendaapp.repository;

import com.agendaapp.model.EstadoReserva;
import com.agendaapp.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    long countByServicioIdAndEstado(Long servicioId, EstadoReserva estado);

    boolean existsByClienteIdAndServicioIdAndEstado(Long clienteId, Long servicioId, EstadoReserva estado);

    List<Reserva> findByClienteIdOrderByServicioFechaHoraAsc(Long clienteId);

    List<Reserva> findByServicioProveedorIdOrderByServicioFechaHoraAsc(Long proveedorId);

    Optional<Reserva> findByIdAndClienteId(Long id, Long clienteId);
}