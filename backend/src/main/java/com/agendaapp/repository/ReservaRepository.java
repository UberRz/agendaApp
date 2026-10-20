package com.agendaapp.repository;

import com.agendaapp.model.EstadoReserva;
import com.agendaapp.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    long countByServicioIdAndEstado(Long servicioId, EstadoReserva estado);

    boolean existsByClienteIdAndServicioIdAndEstado(Long clienteId, Long servicioId, EstadoReserva estado);

    // Reservas del cliente con su servicio ya cargado (para validar solapamiento de horarios sin N+1)
    @Query("""
        SELECT r FROM Reserva r JOIN FETCH r.servicio
        WHERE r.cliente.id = :clienteId
          AND r.estado = :estado
        """)
    List<Reserva> findByClienteConServicio(@Param("clienteId") Long clienteId,
                                           @Param("estado") EstadoReserva estado);

    List<Reserva> findByClienteIdOrderByServicioFechaHoraAsc(Long clienteId);

    List<Reserva> findByServicioProveedorIdOrderByServicioFechaHoraAsc(Long proveedorId);

    Optional<Reserva> findByIdAndClienteId(Long id, Long clienteId);
}
