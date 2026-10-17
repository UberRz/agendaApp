const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "");

export type Role = "student" | "staff";

export type ApiUser = {
  id: number;
  nombre: string;
  email: string;
  username: string;
  telefono: string;
  tipoUsuario: "CLIENTE" | "PROVEEDOR";
};

export type ApiService = {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion: number;
  precio?: number;
  proveedorId: number;
  nombreProveedor: string;
  idioma: string;
  nivel: string;
  fechaHora: string;
  capacidad: number;
  cuposDisponibles: number;
};

export type ApiReservation = {
  id: number;
  clienteId: number;
  nombreCliente: string;
  servicioId: number;
  nombreServicio: string;
  idioma: string;
  nivel: string;
  fechaHora: string;
  fechaReserva: string;
  estado: "ACTIVA" | "CANCELADA";
  cuposDisponibles: number;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "No fue posible completar la solicitud.");
  }
  return body as T;
}

export function login(identificador: string, password: string) {
  return request<ApiUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identificador, password }),
  });
}

export function register(data: {
  nombre: string;
  email: string;
  username: string;
  telefono: string;
  password: string;
  tipoUsuario: "CLIENTE" | "PROVEEDOR";
  nombreNegocio?: string;
  especialidad?: string;
}) {
  return request<ApiUser>("/auth/registro", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listServices() {
  return request<ApiService[]>("/servicios");
}

export function createService(proveedorId: number, data: {
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
  idioma: string;
  nivel: string;
  fechaHora: string;
  capacidad: number;
}) {
  return request<ApiService>(`/servicios?proveedorId=${proveedorId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createReservation(clienteId: number, servicioId: number) {
  return request<ApiReservation>("/reservas", {
    method: "POST",
    body: JSON.stringify({ clienteId, servicioId }),
  });
}

export function listClientReservations(clienteId: number) {
  return request<ApiReservation[]>(`/reservas/cliente/${clienteId}`);
}

export function listProviderReservations(proveedorId: number) {
  return request<ApiReservation[]>(`/reservas/proveedor/${proveedorId}`);
}

export function cancelReservation(reservaId: number, clienteId: number) {
  return request<ApiReservation>(`/reservas/${reservaId}?clienteId=${clienteId}`, {
    method: "DELETE",
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(value))
    .replace(".", "");
}

function formatTime(value: string) {
  const date = new Date(value);
  const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  return `${date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false })} – ${end.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
}

export function serviceToCourse(service: ApiService) {
  return {
    id: service.id,
    reservationId: undefined as number | undefined,
    name: service.nombre,
    language: service.idioma,
    level: service.nivel,
    date: formatDate(service.fechaHora),
    time: formatTime(service.fechaHora),
    teacher: service.nombreProveedor,
    academy: service.nombreProveedor,
    seats: service.cuposDisponibles,
    total: service.capacidad,
  };
}

export function reservationToCourse(reservation: ApiReservation) {
  return {
    id: reservation.servicioId,
    reservationId: reservation.id,
    name: reservation.nombreServicio,
    language: reservation.idioma,
    level: reservation.nivel,
    date: formatDate(reservation.fechaHora),
    time: formatTime(reservation.fechaHora),
    teacher: reservation.nombreCliente,
    academy: "Agenda Fácil",
    seats: reservation.cuposDisponibles,
    total: reservation.cuposDisponibles,
  };
}
