import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { login, register, listServices, createService, createReservation, listClientReservations, listProviderReservations, cancelReservation, serviceToCourse, reservationToCourse, type ApiService, type ApiUser, type ApiReservation, type Role } from "./api";

type Screen =
  | "login"
  | "account-type"
  | "student-register"
  | "staff-register"
  | "language"
  | "confirmation"
  | "student-dashboard"
  | "staff-dashboard"
  | "student-classes"
  | "staff-classes"
  | "staff-availability"
  | "history"
  | "search"
  | "booking-detail"
  | "booking-success"
  | "cancellation-success"
  | "no-seats";

type IconName =
  | "calendar"
  | "book"
  | "user"
  | "users"
  | "school"
  | "clock"
  | "history"
  | "search"
  | "check"
  | "arrow"
  | "eye"
  | "eyeOff"
  | "alert"
  | "globe"
  | "home"
  | "menu"
  | "close"
  | "logout"
  | "chevron"
  | "filter";

const paths: Record<IconName, ReactNode> = {
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h6"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  school: <><path d="m3 10 9-6 9 6-9 6-9-6Z"/><path d="M7 13.5V18l5 3 5-3v-4.5M21 10v6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  arrow: <><path d="m9 18 6-6-6-6"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  eyeOff: <><path d="m3 3 18 18M10.6 6.2c.46-.13.93-.2 1.4-.2 6.5 0 10 6 10 6a18 18 0 0 1-2.1 2.8M6.6 6.6C3.5 8.4 2 12 2 12s3.5 6 10 6c1.7 0 3.15-.4 4.36-1M10.6 10.6a2 2 0 0 0 2.8 2.8"/></>,
  alert: <><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3M15 3h5v18h-5"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  filter: <path d="M4 5h16M7 12h10M10 19h4"/>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, onClick, variant = "primary", type = "button", disabled = false, icon }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; type?: "button" | "submit"; disabled?: boolean; icon?: IconName }) {
  return <button className={`button ${variant}`} onClick={onClick} type={type} disabled={disabled}>{children}{icon && <Icon name={icon} size={18}/>}</button>;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="brand"><span className="brand-mark"><Icon name="calendar" size={compact ? 19 : 23}/></span><span>Agenda <b>Fácil</b></span></div>;
}

function Field({ label, name, type = "text", placeholder, value, onChange, error, helper, required = true }: { label: string; name: string; type?: string; placeholder?: string; value: string; onChange: (value: string) => void; error?: string; helper?: string; required?: boolean }) {
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  return <label className={`field ${error ? "field-error" : ""}`}><span>{label}{required && <em>*</em>}</span><div className="input-wrap"><input name={name} type={password && visible ? "text" : type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>{password && <button type="button" className="icon-button" aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setVisible(!visible)}><Icon name={visible ? "eyeOff" : "eye"}/></button>}</div>{error ? <small className="field-message error-text"><Icon name="alert" size={14}/>{error}</small> : helper && <small>{helper}</small>}</label>;
}

function Notice({ kind, children }: { kind: "error" | "success" | "info"; children: ReactNode }) {
  return <div className={`notice ${kind}`}><span className="notice-icon"><Icon name={kind === "error" ? "alert" : "check"} size={17}/></span><span>{children}</span></div>;
}

function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "red" | "gray" }) {
  return <span className={`badge ${tone}`}><span className="badge-dot"/>{children}</span>;
}

function Header({ role, current, navigate, user }: { role: Role; current: string; navigate: (s: Screen) => void; user?: ApiUser | null }) {
  const [open, setOpen] = useState(false);
  const studentItems = [
    ["Inicio", "student-dashboard", "home"], ["Clases disponibles", "search", "search"], ["Mis clases", "student-classes", "calendar"], ["Historial", "history", "history"],
  ] as [string, Screen, IconName][];
  const staffItems = [
    ["Inicio", "staff-dashboard", "home"], ["Clases agendadas", "staff-classes", "calendar"], ["Historial", "history", "history"], ["Disponibilidad", "staff-availability", "clock"],
  ] as [string, Screen, IconName][];
  const items = role === "student" ? studentItems : staffItems;
  const profileName = user?.nombre || (role === "student" ? "Estudiante" : "Personal de academia");
  const profileInitials = user?.nombre ? user.nombre.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() : role === "student" ? "ES" : "PA";
  return <header className="app-header"><div className="header-inner"><Brand compact/><nav className={open ? "nav open" : "nav"}>{items.map(([label, screen, icon]) => <button key={label} className={current === screen ? "nav-item active" : "nav-item"} onClick={() => { navigate(screen); setOpen(false); }}><Icon name={icon} size={17}/>{label}</button>)}</nav><div className="profile"><span className="avatar">{profileInitials}</span><span className="profile-copy"><b>{profileName}</b><small>{user?.tipoUsuario === "PROVEEDOR" || role === "staff" ? "Personal de academia" : "Estudiante"}</small></span><button className="icon-button desktop-only" aria-label="Cerrar sesión" onClick={() => navigate("login")}><Icon name="logout"/></button></div><button className="menu-button" aria-label="Abrir menú" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"}/></button></div></header>;
}

function Page({ role, current, navigate, user, children }: { role: Role; current: string; navigate: (s: Screen) => void; user?: ApiUser | null; children: ReactNode }) {
  return <div className="app-shell"><Header role={role} current={current} navigate={navigate} user={user}/><main className="page">{children}</main></div>;
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function AuthLayout({ children, step }: { children: ReactNode; step?: string }) {
  return <div className="auth-page"><div className="auth-brand"><Brand/><div className="auth-illustration"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="floating-card card-a"><Icon name="book" size={28}/></span><span className="floating-card card-b"><Icon name="globe" size={25}/></span><div className="illustration-main"><span><Icon name="school" size={55}/></span></div></div><div className="auth-message"><span className="eyebrow light">Tu aprendizaje, a tu ritmo</span><h2>Organiza tus clases de forma fácil y segura</h2><p>Reserva, consulta y gestiona tus clases de idiomas en un solo lugar.</p></div><div className="trust-row"><span><Icon name="check" size={15}/> Horarios claros</span><span><Icon name="check" size={15}/> Reserva segura</span></div></div><main className="auth-content">{step && <span className="step">{step}</span>}{children}</main></div>;
}

const initialForm = { name: "", email: "", username: "", password: "", phone: "", academy: "" };

function Login({ navigate, setRole, setUser }: { navigate: (s: Screen) => void; setRole: (r: Role) => void; setUser: (user: ApiUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(username.trim(), password);
      const nextRole = user.tipoUsuario === "PROVEEDOR" ? "staff" : "student";
      setUser(user);
      setRole(nextRole);
      navigate(nextRole === "student" ? "student-dashboard" : "staff-dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "El usuario o la contraseña no son válidos.");
    } finally {
      setSubmitting(false);
    }
  }
  return <AuthLayout><div className="auth-form login-form"><span className="mobile-brand"><Brand/></span><div className="form-heading"><span className="eyebrow">Bienvenido de nuevo</span><h1>Inicia sesión</h1><p>Accede a tu cuenta para continuar aprendiendo.</p></div>{error && <Notice kind="error">{error}</Notice>}<form onSubmit={submit}><Field label="Nombre de usuario o correo" name="username" value={username} onChange={(v) => { setUsername(v); setError(""); }} placeholder="Escribe tu usuario o correo" error={error ? "Revisa los datos ingresados." : undefined}/><Field label="Contraseña" name="password" type="password" value={password} onChange={(v) => { setPassword(v); setError(""); }} placeholder="Ingresa tu contraseña" error={error ? "Revisa los datos ingresados." : undefined}/><Button type="submit" disabled={submitting} icon="arrow">{submitting ? "Ingresando..." : "Iniciar sesión"}</Button></form><div className="demo-box"><b>Acceso de demostración</b><p>Usa las credenciales configuradas en PostgreSQL.</p></div><div className="divider"><span>¿Aún no tienes cuenta?</span></div><Button variant="secondary" onClick={() => navigate("account-type")}>Crear una cuenta</Button><p className="auth-footnote">Para estudiantes y personal de la academia.</p></div></AuthLayout>;
}

function AccountType({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<Role | null>(null);
  const [error, setError] = useState(false);
  function next() {
    if (!selected) return setError(true);
    navigate(selected === "student" ? "student-register" : "staff-register");
  }
  return <AuthLayout step="Paso 1 de 2"><div className="auth-form wide"><span className="mobile-brand"><Brand/></span><div className="form-heading"><span className="eyebrow">Crea tu cuenta</span><h1>¿Qué tipo de cuenta necesitas?</h1><p>Selecciona una opción para continuar con tu registro.</p></div><div className="selection-grid"><SelectionCard icon="user" title="Estudiante" description="Quiero reservar clases y gestionar mis horarios." selected={selected === "student"} onClick={() => { setSelected("student"); setError(false); }}/><SelectionCard icon="school" title="Personal de la academia" description="Quiero gestionar clases y consultar las reservas." selected={selected === "staff"} onClick={() => { setSelected("staff"); setError(false); }}/></div>{error && <Notice kind="error">Selecciona un tipo de cuenta para continuar.</Notice>}<div className="form-actions"><Button variant="secondary" onClick={() => navigate("login")}>Volver</Button><Button onClick={next} icon="arrow">Continuar</Button></div></div></AuthLayout>;
}

function SelectionCard({ icon, title, description, selected, onClick }: { icon: IconName; title: string; description: string; selected: boolean; onClick: () => void }) {
  return <button className={`selection-card ${selected ? "selected" : ""}`} onClick={onClick}><span className="selection-icon"><Icon name={icon} size={28}/></span>{selected && <span className="selection-check"><Icon name="check" size={15}/></span>}<b>{title}</b><p>{description}</p></button>;
}

function Register({ role, navigate, setConfirmRole }: { role: Role; navigate: (s: Screen) => void; setConfirmRole: (r: Role) => void }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const update = (key: string, value: string) => { setForm({ ...form, [key]: value }); setErrors({ ...errors, [key]: "" }); };
  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    const required = role === "staff" ? Object.keys(initialForm) : Object.keys(initialForm).filter((k) => k !== "academy");
    required.forEach((key) => { if (!form[key as keyof typeof form].trim()) next[key] = "Este campo es obligatorio."; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Utiliza un correo electrónico válido.";
    if (form.email.toLowerCase() === "registrado@correo.com") next.email = "Este correo electrónico ya está registrado. Utiliza otro correo.";
    if (form.username.toLowerCase() === "estudiante") next.username = "Este nombre de usuario ya está registrado. Elige otro.";
    if (form.password && (form.password.length < 8 || !/[^\w\s]/.test(form.password))) next.password = "La contraseña debe tener mínimo 8 caracteres y al menos un símbolo.";
    setErrors(next);
    if (!Object.keys(next).length) {
      setSubmitting(true);
      try {
        await register({
          nombre: form.name,
          email: form.email,
          username: form.username,
          telefono: form.phone,
          password: form.password,
          tipoUsuario: role === "staff" ? "PROVEEDOR" : "CLIENTE",
          nombreNegocio: form.academy,
        });
        setConfirmRole(role);
        navigate(role === "staff" ? "language" : "confirmation");
      } catch (requestError) {
        setErrors({ form: requestError instanceof Error ? requestError.message : "No fue posible crear la cuenta." });
      } finally {
        setSubmitting(false);
      }
    }
  }
  const student = role === "student";
  return <AuthLayout step={student ? "Paso 2 de 2" : "Paso 2 de 3"}><div className="auth-form register-form"><span className="mobile-brand"><Brand/></span><div className="form-heading"><span className="eyebrow">{student ? "Cuenta de estudiante" : "Cuenta de academia"}</span><h1>{student ? "Crea tu cuenta de estudiante" : "Registra tu cuenta de academia"}</h1><p>{student ? "Ingresa tus datos para comenzar a reservar clases." : "Completa tus datos para gestionar las clases y reservas."}</p></div>{Object.keys(errors).length > 2 && <Notice kind="error">Completa todos los campos obligatorios para continuar.</Notice>}<form onSubmit={submit}><div className="form-grid"><Field label="Nombre completo" name="name" value={form.name} onChange={(v) => update("name", v)} placeholder="Ej. Lucía Martínez" error={errors.name}/><Field label="Correo electrónico" name="email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="nombre@correo.com" helper="Utiliza un correo electrónico válido." error={errors.email}/><Field label="Nombre de usuario" name="username" value={form.username} onChange={(v) => update("username", v)} placeholder="Elige un usuario" helper="El nombre de usuario debe ser único." error={errors.username}/><Field label="Número telefónico" name="phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+34 600 000 000" error={errors.phone}/>{!student && <Field label="Nombre de la academia" name="academy" value={form.academy} onChange={(v) => update("academy", v)} placeholder="Ej. Centro de Idiomas Ágora" error={errors.academy}/>}<Field label="Contraseña" name="password" type="password" value={form.password} onChange={(v) => update("password", v)} placeholder="Crea una contraseña segura" helper="Mínimo 8 caracteres y al menos un símbolo." error={errors.password}/></div><div className="form-actions"><Button variant="secondary" onClick={() => navigate("account-type")}>Volver</Button><Button type="submit" icon="arrow">{student ? "Crear cuenta" : "Continuar"}</Button></div></form><p className="required-note">* Campos obligatorios</p></div></AuthLayout>;
}

function Language({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(false);
  const languages = ["Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Otro idioma"];
  return <AuthLayout step="Paso 3 de 3"><div className="auth-form wide"><span className="mobile-brand"><Brand/></span><div className="form-heading"><span className="eyebrow">Configura tu academia</span><h1>¿Qué tipo de clase ofreces?</h1><p>Selecciona el idioma principal de las clases de tu academia.</p></div><div className="language-grid">{languages.map((language) => <SelectionCard key={language} icon="globe" title={language} description={language === "Otro idioma" ? "Configúralo más adelante" : `Clases y cursos de ${language.toLowerCase()}`} selected={selected === language} onClick={() => { setSelected(language); setError(false); }}/>)}</div>{error && <Notice kind="error">Selecciona un idioma para continuar.</Notice>}<div className="form-actions"><Button variant="secondary" onClick={() => navigate("staff-register")}>Volver</Button><Button onClick={() => selected ? navigate("confirmation") : setError(true)} icon="arrow">Continuar</Button></div></div></AuthLayout>;
}

function Confirmation({ role, navigate }: { role: Role; navigate: (s: Screen) => void }) {
  return <div className="center-page"><div className="success-card"><Brand/><span className="success-icon"><Icon name="check" size={44}/></span><span className="eyebrow">Registro exitoso</span><h1>{role === "student" ? "¡Tu cuenta está lista!" : "¡Registro completado!"}</h1><p>{role === "student" ? "Tu registro se completó correctamente. Ya puedes iniciar sesión y reservar tus próximas clases." : "Tu cuenta y configuración fueron registradas correctamente."}</p><Button onClick={() => navigate("login")} icon="arrow">Ir al inicio de sesión</Button><small>Te damos la bienvenida a Agenda Fácil</small></div></div>;
}

const availableClass = { id: 1001, reservationId: undefined as number | undefined, name: "Inglés Conversacional B1", language: "Inglés", level: "B1 Intermedio", date: "20 oct 2026", time: "18:00 – 20:00", teacher: "Laura González", academy: "Centro de Idiomas Ágora", seats: 8, total: 20 };
const staticProviderClasses = [
  availableClass,
  { id: 1002, reservationId: undefined as number | undefined, name: "Francés Inicial A1", language: "Francés", level: "A1 Inicial", date: "22 oct 2026", time: "10:00 – 12:00", teacher: "Sophie Martin", academy: "Lingua Nova", seats: 8, total: 16 },
  { id: 1003, reservationId: undefined as number | undefined, name: "Alemán Intermedio B1", language: "Alemán", level: "B1 Intermedio", date: "24 oct 2026", time: "09:00 – 11:00", teacher: "Felix Müller", academy: "Sprach Haus", seats: 0, total: 20 },
  { id: 1004, reservationId: undefined as number | undefined, name: "Italiano Conversacional A2", language: "Italiano", level: "A2 Básico", date: "26 oct 2026", time: "17:00 – 19:00", teacher: "Giulia Rossi", academy: "Centro Ágora", seats: 9, total: 14 },
];

function StatCard({ icon, label, value, detail, tone = "blue" }: { icon: IconName; label: string; value: string; detail: string; tone?: string }) {
  return <div className="stat-card"><span className={`stat-icon ${tone}`}><Icon name={icon}/></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></div>;
}

function StudentDashboard({ navigate, user, onSelect, localBookings }: { navigate: (s: Screen) => void; user: ApiUser; onSelect: (course: typeof availableClass) => void; localBookings: typeof availableClass[] }) {
  const [reservations, setReservations] = useState<ReturnType<typeof reservationToCourse>[]>([]);
  const [availableCourses, setAvailableCourses] = useState<typeof availableClass[]>([]);
  useEffect(() => {
    listClientReservations(user.id)
      .then((items) => setReservations(items.filter((item) => item.estado === "ACTIVA").map(reservationToCourse)))
      .catch(() => setReservations([]));
  }, [user.id]);
  useEffect(() => {
    listServices()
      .then((services) => setAvailableCourses(services.length ? services.filter((service) => service.cuposDisponibles > 0).map(serviceToCourse) : staticProviderClasses))
      .catch(() => setAvailableCourses(staticProviderClasses));
  }, []);
  const dashboardReservations = [...reservations, ...localBookings];
  const nextReservation = dashboardReservations[0];
  return <Page role="student" current="student-dashboard" navigate={navigate} user={user}><PageHeading eyebrow="Tu agenda" title={`¡Hola, ${user.nombre}!`} subtitle="Encuentra y reserva tus próximas clases de idiomas." action={<Button onClick={() => navigate("search")} icon="search">Clases disponibles</Button>}/><div className="stats-grid"><StatCard icon="calendar" label="Próximas clases" value={`${dashboardReservations.length}`} detail="Reservas activas"/><StatCard icon="check" label="Reservas activas" value={`${dashboardReservations.length}`} detail="Todas confirmadas" tone="green"/><StatCard icon="book" label="Clases realizadas" value="0" detail="Aún no tienes clases realizadas" tone="purple"/></div><section className="content-section"><div className="section-heading"><div><span className="eyebrow">Tu agenda</span><h2>Próxima clase</h2></div><button className="text-button" onClick={() => navigate("student-classes")}>Ver todas <Icon name="arrow" size={16}/></button></div><div className="featured-class"><div className="date-tile"><b>{nextReservation?.date.split(" ")[0] || "-"}</b><span>{nextReservation?.date.split(" ")[1]?.toUpperCase() || ""}</span></div><div className="class-main"><div className="card-top"><Badge tone={nextReservation ? "green" : "gray"}>{nextReservation ? "Confirmada" : "Sin reservas"}</Badge><span className="language-label"><Icon name="globe" size={15}/> {nextReservation ? `${nextReservation.language} · ${nextReservation.level}` : "Busca una clase disponible"}</span></div><h3>{nextReservation?.name || "Aún no tienes clases agendadas"}</h3><p>{nextReservation ? "Consulta los detalles de tu próxima clase." : "Cuando reserves una clase aparecerá aquí."}</p><div className="meta-row"><span><Icon name="clock" size={17}/>{nextReservation?.time || "-"}</span><span><Icon name="user" size={17}/>{nextReservation?.teacher || "-"}</span><span><Icon name="school" size={17}/>{nextReservation?.academy || "-"}</span></div></div><button className="round-link" aria-label="Ver mis clases" onClick={() => navigate("student-classes")}><Icon name="arrow"/></button></div></section><section className="content-section"><div className="section-heading"><div><span className="eyebrow">Catálogo</span><h2>Clases disponibles</h2></div><button className="text-button" onClick={() => navigate("search")}>Ver catálogo <Icon name="arrow" size={16}/></button></div>{availableCourses.length ? <div className="course-grid">{availableCourses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} onSelect={() => { onSelect(course); navigate("booking-detail"); }}/>)}</div> : <EmptyState icon="book" title="No hay clases disponibles todavía." text="Cuando un proveedor publique una clase, aparecerá aquí."/>}</section><section className="quick-grid"><button className="quick-card" onClick={() => navigate("search")}><span className="quick-icon"><Icon name="search"/></span><div><b>Clases disponibles</b><p>Explora idiomas, niveles y horarios.</p></div><Icon name="chevron"/></button><button className="quick-card" onClick={() => navigate("history")}><span className="quick-icon mint"><Icon name="history"/></span><div><b>Historial</b><p>Revisa tus clases anteriores.</p></div><Icon name="chevron"/></button></section></Page>;
}

function CreateServiceForm({ providerId }: { providerId: number }) {
  const [form, setForm] = useState({ nombre: "", descripcion: "", idioma: "Inglés", nivel: "B1", fechaHora: "", duracion: "120", precio: "0", capacidad: "20" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!form.nombre.trim() || !form.fechaHora || Number(form.capacidad) <= 0 || Number(form.duracion) <= 0) {
      setError("Completa el nombre, la fecha y hora, la duración y una capacidad mayor que cero.");
      return;
    }
    try {
      await createService(providerId, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        idioma: form.idioma,
        nivel: form.nivel,
        fechaHora: form.fechaHora,
        duracion: Number(form.duracion),
        precio: Number(form.precio),
        capacidad: Number(form.capacidad),
      });
      setMessage("Clase publicada correctamente. Ya está disponible para los estudiantes.");
      setForm((current) => ({ ...current, nombre: "", descripcion: "", fechaHora: "" }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No fue posible publicar la clase.");
    }
  }
  return <section className="content-section"><div className="section-heading"><div><span className="eyebrow">Nueva clase</span><h2>Publicar una clase</h2></div></div>{message && <Notice kind="success">{message}</Notice>}{error && <Notice kind="error">{error}</Notice>}<form className="form-grid" onSubmit={submit}><Field label="Nombre de la clase" name="nombre" value={form.nombre} onChange={(value) => update("nombre", value)} placeholder="Ej. Inglés Conversacional B1"/><Field label="Descripción" name="descripcion" value={form.descripcion} onChange={(value) => update("descripcion", value)} placeholder="Describe la clase"/><Field label="Idioma" name="idioma" value={form.idioma} onChange={(value) => update("idioma", value)} placeholder="Inglés"/><Field label="Nivel" name="nivel" value={form.nivel} onChange={(value) => update("nivel", value)} placeholder="B1"/><Field label="Fecha y hora" name="fechaHora" type="datetime-local" value={form.fechaHora} onChange={(value) => update("fechaHora", value)}/><Field label="Duración (minutos)" name="duracion" type="number" value={form.duracion} onChange={(value) => update("duracion", value)}/><Field label="Precio" name="precio" type="number" value={form.precio} onChange={(value) => update("precio", value)}/><Field label="Capacidad" name="capacidad" type="number" value={form.capacidad} onChange={(value) => update("capacidad", value)}/><Button type="submit" icon="check">Publicar clase</Button></form></section>;
}

function StaffDashboard({ navigate, user }: { navigate: (s: Screen) => void; user: ApiUser }) {
  return <Page role="staff" current="staff-dashboard" navigate={navigate} user={user}><PageHeading eyebrow="Resumen de hoy" title={`Panel de ${user.nombre}`} subtitle="Gestiona tus clases y consulta las reservas de los estudiantes." action={<Button onClick={() => navigate("staff-classes")} icon="calendar">Ver agenda</Button>}/><CreateServiceForm providerId={user.id}/><div className="stats-grid four"><StatCard icon="calendar" label="Clases próximas" value="8" detail="3 esta semana"/><StatCard icon="users" label="Estudiantes" value="146" detail="+12 este mes" tone="purple"/><StatCard icon="clock" label="Cupos disponibles" value="42" detail="En 8 clases" tone="amber"/><StatCard icon="check" label="Reservas" value="86" detail="Este mes" tone="green"/></div><section className="content-section"><div className="section-heading"><div><span className="eyebrow">Agenda</span><h2>Próximas clases</h2></div><button className="text-button" onClick={() => navigate("staff-classes")}>Ver clases agendadas <Icon name="arrow" size={16}/></button></div><ClassRow/><ClassRow second/></section><section className="academy-callout"><div className="callout-icon"><Icon name="history" size={25}/></div><div><b>Historial de reservaciones</b><p>Consulta el rendimiento y las reservas anteriores de tu academia.</p></div><Button variant="secondary" onClick={() => navigate("history")}>Ver historial</Button></section></Page>;
}

function ClassRow({ second = false }: { second?: boolean }) {
  return <div className="class-row"><div className="date-tile small"><b>{second ? "22" : "20"}</b><span>OCT</span></div><div className="class-row-title"><b>{second ? "Francés Inicial A1" : "Inglés Conversacional B1"}</b><span><Icon name="clock" size={15}/>{second ? "10:00 – 12:00" : "18:00 – 20:00"}</span></div><div className="occupancy"><div><span>Ocupación</span><b>{second ? "8 / 16" : "12 / 20"} estudiantes</b></div><div className="progress"><i style={{ width: second ? "50%" : "60%" }}/></div></div><span className="seats">{second ? "8" : "8"} cupos disponibles</span><Badge tone="blue">Programada</Badge></div>;
}

function Tabs({ active, setActive, options }: { active: string; setActive: (v: string) => void; options: string[] }) {
  return <div className="tabs">{options.map((option) => <button key={option} className={active === option ? "active" : ""} onClick={() => setActive(option)}>{option}</button>)}</div>;
}

function StudentClasses({ navigate, localBookings, newBooking, clientId, onCancel, user }: { navigate: (s: Screen) => void; localBookings: typeof availableClass[]; newBooking: string | null; clientId: number; onCancel: (course: typeof availableClass) => void; user?: ApiUser | null }) {
  const [tab, setTab] = useState("Próximas");
  const [confirming, setConfirming] = useState<typeof availableClass | null>(null);
  const [remoteReservations, setRemoteReservations] = useState<ApiReservation[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    listClientReservations(clientId)
      .then((reservations) => { setRemoteReservations(reservations); setLoaded(true); })
      .catch(() => { setRemoteReservations([]); setLoaded(true); });
  }, [clientId]);
  // Bug 2: todas las reservas activas salen del backend (no solo la última)
  const activeReservations = remoteReservations
    .filter((r) => r.estado === "ACTIVA")
    .map(reservationToCourse);
  // Bug 1: las "Realizadas" ahora salen de las CANCELADA reales
  const completedReservations = remoteReservations
    .filter((r) => r.estado === "CANCELADA")
    .map(reservationToCourse);
  // localBookings: solo clases de demostración (id >= 1000) que no existen en el backend
  const upcomingReservations = [...(loaded ? activeReservations : []), ...localBookings];
  return <Page role="student" current="student-classes" navigate={navigate} user={user}><PageHeading title="Mis clases agendadas" subtitle="Consulta tus próximas clases y el estado de tus reservas." action={<Button onClick={() => navigate("search")} icon="search">Buscar clases</Button>}/><Tabs active={tab} setActive={setTab} options={["Próximas", "Realizadas"]}/><div className="class-list">{tab === "Próximas" ? (upcomingReservations.length ? upcomingReservations.map((course) => <ReservationCard key={`upcoming-${course.id}-${course.reservationId ?? "local"}`} featured={(course.reservationId ? `r:${course.reservationId}` : `l:${course.id}`) === newBooking} course={course} onCancel={() => setConfirming(course)}/>) : <EmptyState icon="calendar" title="No tienes clases agendadas." text="Cuando reserves una clase, aparecerá aquí." action={<Button variant="secondary" onClick={() => navigate("search")}>Buscar clases</Button>}/>) : completedReservations.length ? completedReservations.map((course) => <ReservationCard key={`done-${course.id}-${course.reservationId}`} course={course} cancelled/>) : <EmptyState icon="history" title="No tienes clases realizadas todavía." text="Las reservas canceladas aparecerán aquí."/>}</div>{confirming && <CancellationModal course={confirming} onKeep={() => setConfirming(null)} onConfirm={() => { const course = confirming; setConfirming(null); onCancel(course); }}/>}</Page>;
}

function ReservationCard({ featured = false, pending = false, completed = false, second = false, cancelled = false, course, onCancel }: { featured?: boolean; pending?: boolean; completed?: boolean; second?: boolean; cancelled?: boolean; course?: typeof availableClass; onCancel?: () => void }) {
  const name = course ? course.name : second ? "Pronunciación Francesa A2" : completed ? "Inglés para Viajes A2" : pending ? "Taller de Escritura B2" : "Francés Inicial A1";
  const status = cancelled ? "Cancelada" : completed ? "Completada" : pending ? "Pendiente" : "Confirmada";
  return <article className={`reservation-card ${featured ? "new" : ""} ${cancelled ? "cancelled" : ""}`}><div className="course-icon"><Icon name={cancelled ? "close" : completed ? "check" : "book"} size={23}/></div><div className="reservation-title">{featured && !cancelled && <span className="new-label">NUEVA RESERVA</span>}<h3>{name}</h3><p>{course ? course.language : second || pending ? "Francés" : "Inglés"} · {course ? course.level : second ? "A2" : pending ? "B2 Avanzado" : "A1 Inicial"}</p></div><div className="reservation-meta"><span><small>FECHAS</small><b>{course ? course.date : completed ? "10 ago – 10 sep 2026" : "22 oct – 17 dic 2026"}</b></span><span><small>HORARIO</small><b>{course ? course.time : pending ? "16:00 – 18:00" : "18:00 – 20:00"}</b></span><span><small>PROFESOR</small><b>{course ? course.teacher : second ? "Sophie Martin" : "Laura González"}</b></span></div><div className="reservation-actions"><Badge tone={cancelled ? "red" : completed ? "gray" : pending ? "amber" : "green"}>{status}</Badge>{course && !cancelled && !completed && <button className="cancel-link" onClick={onCancel}>Cancelar reserva</button>}</div></article>;
}

function CancellationModal({ course, onKeep, onConfirm }: { course: typeof availableClass; onKeep: () => void; onConfirm: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onKeep(); }}><div className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title"><button className="modal-close" aria-label="Cerrar" onClick={onKeep}><Icon name="close"/></button><span className="modal-alert"><Icon name="alert" size={27}/></span><h2 id="cancel-title">Cancelar reserva</h2><p>¿Estás seguro de que deseas cancelar esta reserva?</p><div className="cancel-details"><div><small>CURSO</small><b>{course.name}</b><span>{course.language} · {course.level}</span></div><div className="cancel-detail-grid"><span><small>FECHA</small><b>{course.date}</b></span><span><small>HORARIO</small><b>{course.time}</b></span><span><small>ESTADO ACTUAL</small><Badge tone="green">Confirmada</Badge></span><span><small>DISPONIBILIDAD</small><b>{course.seats} cupos disponibles</b></span></div></div><Notice kind="info">Al cancelar, tu cupo quedará disponible para otro estudiante.</Notice><div className="modal-actions"><Button variant="secondary" onClick={onKeep}>Mantener reserva</Button><Button variant="danger" onClick={onConfirm}>Confirmar cancelación</Button></div></div></div>;
}

const academyClasses = [
  { name: "Inglés Conversacional B1", level: "Inglés · B1", date: "20 oct 2026", time: "18:00 – 20:00", current: 12, total: 20, status: "Programada" },
  { name: "Francés Inicial A1", level: "Francés · A1", date: "22 oct 2026", time: "10:00 – 12:00", current: 8, total: 16, status: "Programada" },
  { name: "Alemán Intermedio B1", level: "Alemán · B1", date: "24 oct 2026", time: "09:00 – 11:00", current: 20, total: 20, status: "Programada" },
  { name: "Italiano Conversacional A2", level: "Italiano · A2", date: "26 oct 2026", time: "17:00 – 19:00", current: 5, total: 14, status: "Programada" },
  { name: "Inglés para Viajes A2", level: "Inglés · A2", date: "08 oct 2026", time: "16:00 – 18:00", current: 14, total: 16, status: "Finalizada" },
  { name: "Francés Conversacional B1", level: "Francés · B1", date: "05 oct 2026", time: "18:00 – 20:00", current: 12, total: 14, status: "Finalizada" },
];

function StaffClasses({ navigate, providerId, user }: { navigate: (s: Screen) => void; providerId: number; user?: ApiUser | null }) {
  const [view, setView] = useState("Todas");
  const [month, setMonth] = useState("Octubre 2026");
  const [remoteClasses, setRemoteClasses] = useState<typeof academyClasses>([]);
  useEffect(() => {
    listProviderReservations(providerId).then((reservations) => {
      const grouped = new Map<number, typeof academyClasses[number]>();
      reservations.filter((item) => item.estado === "ACTIVA").forEach((reservation) => {
        const course = reservationToCourse(reservation);
        const current = grouped.get(course.id);
        grouped.set(course.id, current ? { ...current, current: current.current + 1 } : {
          name: course.name,
          level: `${course.language} · ${course.level}`,
          date: course.date,
          time: course.time,
          current: 1,
          total: Math.max(1, course.total),
          status: "Programada",
        });
      });
      setRemoteClasses(Array.from(grouped.values()));
    }).catch(() => setRemoteClasses([]));
  }, [providerId]);
  const classesToShow = remoteClasses.length ? remoteClasses : academyClasses;
  const monthKey = month.startsWith("Octubre") ? "oct" : "nov";
  const visibleClasses = (view === "Todas" ? classesToShow : classesToShow.filter((item) => item.status === view.slice(0, -1))).filter((item) => item.date.includes(` ${monthKey} `));
  return <Page role="staff" current="staff-classes" navigate={navigate} user={user}><PageHeading title="Clases agendadas" subtitle="Consulta las clases programadas y las que ya finalizaron."/><div className="toolbar"><Tabs active={view} setActive={setView} options={["Todas", "Programadas", "Finalizadas"]}/><label className="period"><Icon name="calendar" size={17}/><select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Mes" style={{ border: "none", background: "transparent", font: "inherit", color: "inherit", cursor: "pointer", outline: "none" }}><option>Octubre 2026</option><option>Noviembre 2026</option></select></label></div>{visibleClasses.length ? <><div className="schedule-table"><div className="table-head"><span>Curso / clase</span><span>Fecha y hora</span><span>Ocupación</span><span>Disponibilidad</span><span>Estado</span></div>{visibleClasses.map((item) => <ScheduleItem key={`${item.name}-${item.date}`} {...item}/>)}</div><p className="results-note">Mostrando {visibleClasses.length} {visibleClasses.length === 1 ? "clase" : "clases"} en esta vista.</p></> : <EmptyState icon="calendar" title="No existen clases agendadas." text="No hay clases con reservas en esta vista. Prueba con otro periodo o estado."/>}</Page>;
}

function ScheduleItem({ name, level, date, time, current, total, status = "Programada" }: { name: string; level: string; date: string; time: string; current: number; total: number; status?: string }) {
  const full = current === total;
  const percent = `${(current / total) * 100}%`;
  const completed = status === "Finalizada";
  return <div className="schedule-item"><div className="course-cell"><span className="mini-course"><Icon name="book"/></span><div><b>{name}</b><small>{level}</small></div></div><div className="date-cell"><b>{date}</b><small>{time}</small></div><div className="occupancy"><div><b>{current} / {total}</b><small> estudiantes</small></div><div className="progress"><i className={full ? "full" : ""} style={{ width: percent }}/></div></div><div className={full ? "availability none" : "availability"}><b>{completed ? "—" : total - current}</b><small>{completed ? "Clase cerrada" : full ? "Sin cupos disponibles" : "cupos disponibles"}</small></div><Badge tone={completed ? "gray" : full ? "amber" : "blue"}>{completed ? "Finalizada" : full ? "Llena" : "Programada"}</Badge></div>;
}

function StaffAvailability({ navigate, user }: { navigate: (s: Screen) => void; user?: ApiUser | null }) {
  const upcoming = academyClasses.filter((item) => item.status === "Programada");
  const [capacities, setCapacities] = useState<Record<string, number>>(() => Object.fromEntries(upcoming.map((item) => [item.name, item.total])));
  const [saved, setSaved] = useState("");
  function changeCapacity(name: string, current: number, amount: number) {
    setSaved("");
    setCapacities((values) => ({ ...values, [name]: Math.max(current, Math.min(40, values[name] + amount)) }));
  }
  return <Page role="staff" current="staff-availability" navigate={navigate} user={user}><PageHeading title="Disponibilidad y cupos" subtitle="Configura la capacidad de tus próximas clases y consulta los cupos restantes."/><div className="availability-summary"><StatCard icon="clock" label="Cupos disponibles" value="42" detail="En clases programadas" tone="amber"/><StatCard icon="users" label="Capacidad total" value="70" detail="En 4 clases activas"/><StatCard icon="alert" label="Clases completas" value="1" detail="Requiere seguimiento" tone="purple"/></div>{saved && <Notice kind="success">La capacidad de {saved} se actualizó correctamente.</Notice>}<div className="availability-list">{upcoming.map((item) => {
    const capacity = capacities[item.name];
    const remaining = capacity - item.current;
    return <article className="availability-card" key={item.name}><div className="availability-course"><span className="mini-course"><Icon name="book"/></span><div><h3>{item.name}</h3><p>{item.level} · {item.date} · {item.time}</p></div></div><div className="availability-metric"><small>ESTUDIANTES REGISTRADOS</small><b>{item.current}</b></div><div className="availability-metric"><small>CUPOS DISPONIBLES</small><b className={remaining === 0 ? "no-seats-text" : ""}>{remaining}</b></div><div className="capacity-control"><small>CAPACIDAD TOTAL</small><div><button aria-label={`Reducir capacidad de ${item.name}`} disabled={capacity <= item.current} onClick={() => changeCapacity(item.name, item.current, -1)}>−</button><b>{capacity}</b><button aria-label={`Aumentar capacidad de ${item.name}`} onClick={() => changeCapacity(item.name, item.current, 1)}>+</button></div></div><Button variant="secondary" onClick={() => setSaved(item.name)}>Guardar</Button></article>;
  })}</div></Page>;
}

function History({ navigate, role, clientId, user }: { navigate: (s: Screen) => void; role: Role; clientId?: number; user?: ApiUser | null }) {
  const [filter, setFilter] = useState("Todas");
  const [query, setQuery] = useState("");
  const [remoteEntries, setRemoteEntries] = useState<[string, string, string, string, string][]>([]);
  useEffect(() => {
    if (role !== "student" || !clientId) {
      setRemoteEntries([]);
      return;
    }
    listClientReservations(clientId).then((reservations) => {
      setRemoteEntries(reservations.map((reservation) => {
        const course = reservationToCourse(reservation);
        const status = reservation.estado === "CANCELADA" ? "Cancelada" : "Pendiente";
        return [course.name, `${course.language} · ${course.level}`, course.date, course.time, status];
      }));
    }).catch(() => setRemoteEntries([]));
  }, [role, clientId]);
  const entries = remoteEntries;
  const shown = entries.filter((e) => (filter === "Todas" || e[4].startsWith(filter.slice(0, -1))) && e[0].toLowerCase().includes(query.toLowerCase()));
  return <Page role={role} current="history" navigate={navigate} user={user}><PageHeading title="Historial de reservaciones" subtitle="Consulta las clases y reservas realizadas anteriormente."/><div className="history-toolbar"><div className="search-box"><Icon name="search" size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar en historial…"/></div><div className="filter-pills"><Icon name="filter" size={17}/>{["Todas", "Completadas", "Canceladas", "Pendientes"].map((f) => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div></div>{shown.length ? <div className="history-list">{shown.map((entry, index) => <div className="history-item" key={`${entry[0]}-${entry[2]}-${entry[4]}-${index}`}><span className="history-icon"><Icon name={entry[4] === "Completada" ? "check" : entry[4] === "Cancelada" ? "close" : "clock"}/></span><div className="history-name"><b>{entry[0]}</b><small>{entry[1]}</small></div><div><small>FECHA DE CLASE</small><b>{entry[2]}</b></div><div><small>HORARIO</small><b>{entry[3]}</b></div><div><small>{role === "staff" ? "ESTUDIANTES" : "FECHA DE RESERVA"}</small><b>{role === "staff" ? "12 registrados" : "28 ago 2026"}</b></div><Badge tone={entry[4] === "Completada" ? "gray" : entry[4] === "Cancelada" ? "red" : "amber"}>{entry[4]}</Badge></div>)}</div> : <EmptyState icon="history" title="No tienes reservaciones en el historial." text="Las reservaciones realizadas aparecerán aquí."/>}</Page>;
}

const classes = [
  availableClass,
  { name: "Francés Inicial A1", language: "Francés", level: "A1 Inicial", date: "22 oct 2026", time: "10:00 – 12:00", teacher: "Sophie Martin", academy: "Lingua Nova", seats: 5, total: 16 },
  { name: "Alemán para Viajes A2", language: "Alemán", level: "A2 Básico", date: "24 oct 2026", time: "09:00 – 11:00", teacher: "Felix Müller", academy: "Sprach Haus", seats: 0, total: 14 },
  { name: "Italiano Conversacional A2", language: "Italiano", level: "A2 Básico", date: "26 oct 2026", time: "17:00 – 19:00", teacher: "Giulia Rossi", academy: "Centro Ágora", seats: 9, total: 14 },
];

function SearchClasses({ navigate, onSelect, cancelledCourses, user }: { navigate: (s: Screen) => void; onSelect: (course: typeof availableClass) => void; cancelledCourses: typeof availableClass[]; user?: ApiUser | null }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("Todos");
  const [level, setLevel] = useState("Todos");
  const [date, setDate] = useState("Todas");
  const [schedule, setSchedule] = useState("Todos");
  const [showFull, setShowFull] = useState(false);
  const [listedClasses, setListedClasses] = useState<typeof availableClass[]>([]);
  useEffect(() => {
    listServices().then((services) => setListedClasses(services.length ? services.map(serviceToCourse) : staticProviderClasses)).catch(() => setListedClasses(staticProviderClasses));
  }, []);
  const visibleClasses = listedClasses.map((course) => cancelledCourses.some((cancelled) => cancelled.name === course.name) ? { ...course, seats: course.seats + 1 } : course);
  const filtered = visibleClasses.filter((course) => {
    const startHour = Number(course.time.slice(0, 2));
    return (showFull || course.seats > 0)
      && (language === "Todos" || course.language === language)
      && (level === "Todos" || course.level.startsWith(level))
      && (date === "Todas" || course.date === date)
      && (schedule === "Todos" || (schedule === "Mañana" ? startHour < 12 : startHour >= 12))
      && `${course.name} ${course.language}`.toLowerCase().includes(query.toLowerCase());
  });
  const hasFilters = query || language !== "Todos" || level !== "Todos" || date !== "Todas" || schedule !== "Todos";
  function clearFilters() {
    setQuery(""); setLanguage("Todos"); setLevel("Todos"); setDate("Todas"); setSchedule("Todos"); setShowFull(false);
  }
  const latestCancellation = cancelledCourses.at(-1);
  return <Page role="student" current="search" navigate={navigate} user={user}><PageHeading title="Clases disponibles" subtitle="Encuentra una clase que se ajuste a tus necesidades y horario."/><div className="search-panel filters-panel"><div className="search-box large"><Icon name="search"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar una clase…"/></div><div className="select-filters"><label><span>Idioma</span><select value={language} onChange={(e) => setLanguage(e.target.value)}><option>Todos</option><option>Inglés</option><option>Francés</option><option>Alemán</option><option>Italiano</option></select></label><label><span>Nivel</span><select value={level} onChange={(e) => setLevel(e.target.value)}><option>Todos</option><option>A1</option><option>A2</option><option>B1</option></select></label><label><span>Fecha</span><select value={date} onChange={(e) => setDate(e.target.value)}><option>Todas</option><option>20 oct 2026</option><option>22 oct 2026</option><option>24 oct 2026</option><option>26 oct 2026</option></select></label><label><span>Horario</span><select value={schedule} onChange={(e) => setSchedule(e.target.value)}><option>Todos</option><option>Mañana</option><option>Tarde</option></select></label></div><div className="filter-footer"><button className={`full-toggle ${showFull ? "active" : ""}`} onClick={() => setShowFull(!showFull)}><span className="toggle-track"><i/></span>Mostrar clases completas</button>{hasFilters && <button className="clear-filters" onClick={clearFilters}>Limpiar filtros</button>}</div></div>{latestCancellation && <Notice kind="success">La cancelación liberó un cupo. {latestCancellation.name} ahora tiene {latestCancellation.seats + 1} cupos disponibles.</Notice>}<div className="results-head"><p><b>{filtered.length} clases</b> {showFull ? "encontradas" : "con cupos disponibles"}</p><span>Ordenar: <b>Más próximas</b></span></div>{filtered.length ? <div className="course-grid">{filtered.map((course) => <CourseCard key={course.name} course={course} onSelect={() => { onSelect(course); navigate(course.seats ? "booking-detail" : "no-seats"); }}/>)}</div> : <EmptyState icon="search" title={hasFilters ? "No encontramos clases disponibles con estos criterios." : "No hay clases disponibles."} text={hasFilters ? "Prueba con otros filtros para encontrar una clase." : "En este momento no existen clases con cupos disponibles. Intenta consultar nuevamente más tarde."} action={hasFilters ? <Button variant="secondary" onClick={clearFilters}>Limpiar filtros</Button> : undefined}/>}</Page>;
}

function CourseCard({ course, onSelect }: { course: typeof availableClass; onSelect: () => void }) {
  const unavailable = course.seats === 0;
  return <article className="course-card"><div className={`course-cover ${course.language.toLowerCase()}`}><span className="course-language">{course.language.slice(0, 2).toUpperCase()}</span><Badge tone={unavailable ? "amber" : "green"}>{unavailable ? "Sin cupos disponibles" : `Disponible · ${course.seats} cupos`}</Badge></div><div className="course-body"><span className="level">{course.language} · {course.level}</span><h3>{course.name}</h3><div className="course-details"><span><Icon name="calendar" size={17}/><b>{course.date}</b></span><span><Icon name="clock" size={17}/>{course.time}</span><span><Icon name="user" size={17}/>{course.teacher}</span><span><Icon name="school" size={17}/>{course.academy}</span></div><div className="capacity-row"><div><span>Disponibilidad</span><b>{unavailable ? "Sin cupos disponibles" : `${course.seats} cupos disponibles`}</b></div><div className="progress"><i className={unavailable ? "full" : ""} style={{ width: `${((course.total - course.seats) / course.total) * 100}%` }}/></div></div><div className="card-actions"><Button variant="secondary" onClick={onSelect}>Ver detalles</Button><Button disabled={unavailable} onClick={onSelect}>{unavailable ? "Sin cupos disponibles" : "Reservar"}</Button></div></div></article>;
}

function BookingDetail({ navigate, confirm, course, user }: { navigate: (s: Screen) => void; confirm: () => void; course: typeof availableClass; user?: ApiUser | null }) {
  return <Page role="student" current="search" navigate={navigate} user={user}><div className="back-row"><button className="text-button" onClick={() => navigate("search")}><Icon name="chevron" size={17}/> Volver a clases</button></div><div className="booking-layout"><div><span className="eyebrow">Último paso</span><h1>Confirmar reserva</h1><p className="lead">Revisa la información antes de reservar tu cupo.</p><article className="detail-card"><div className="detail-header"><span className="large-course-icon"><Icon name="book" size={30}/></span><div><Badge tone="green">Disponible · {course.seats} cupos</Badge><h2>{course.name}</h2><p>{course.language} · {course.level}</p></div></div><div className="detail-grid"><Detail icon="calendar" label="Fecha" value={course.date}/><Detail icon="clock" label="Horario" value={course.time}/><Detail icon="user" label="Profesor" value={course.teacher}/><Detail icon="school" label="Academia" value={course.academy}/><Detail icon="globe" label="Idioma y nivel" value={`${course.language} · ${course.level}`}/><Detail icon="users" label="Disponibilidad" value={`${course.seats} de ${course.total} cupos disponibles`}/></div></article></div><aside className="confirm-card"><span className="confirm-icon"><Icon name="calendar" size={27}/></span><h2>¿Deseas confirmar esta reserva?</h2><p>Al confirmar, esta clase se agregará a tu agenda.</p><div className="summary-line"><span>Clase</span><b>{course.name}</b></div><div className="summary-line"><span>Fecha</span><b>{course.date} · {course.time.split(" – ")[0]}</b></div><Notice kind="info">Tu cupo se confirmará de inmediato.</Notice><Button onClick={confirm} icon="check">Confirmar reserva</Button><Button variant="ghost" onClick={() => navigate("search")}>Cancelar</Button></aside></div></Page>;
}

function Detail({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <div className="detail-item"><span><Icon name={icon}/></span><div><small>{label}</small><b>{value}</b></div></div>;
}

function BookingSuccess({ navigate, course }: { navigate: (s: Screen) => void; course: typeof availableClass }) {
  return <div className="center-page booking-success"><div className="success-card booking"><Brand/><span className="success-icon"><Icon name="check" size={44}/></span><span className="eyebrow">Reserva confirmada</span><h1>¡Reserva realizada con éxito!</h1><p>Tu cupo ha sido reservado correctamente.</p><div className="success-summary"><div><span className="mini-course"><Icon name="book"/></span><div><small>CURSO</small><b>{course.name}</b><span>{course.language} · {course.level}</span></div><Badge tone="green">Confirmada</Badge></div><div className="success-info"><span><Icon name="calendar"/><small>FECHA<b>{course.date}</b></small></span><span><Icon name="clock"/><small>HORARIO<b>{course.time}</b></small></span></div></div><div className="success-actions"><Button onClick={() => navigate("student-classes")} icon="calendar">Ver mis clases</Button><Button variant="secondary" onClick={() => navigate("student-dashboard")}>Volver al inicio</Button></div><small>Recibirás un recordatorio antes de la clase.</small></div></div>;
}

function CancellationSuccess({ navigate, course }: { navigate: (s: Screen) => void; course: typeof availableClass }) {
  return <div className="center-page booking-success"><div className="success-card booking"><Brand/><span className="success-icon"><Icon name="check" size={44}/></span><span className="eyebrow">Cancelación completada</span><h1>¡Reserva cancelada!</h1><p>La reserva de tu clase fue cancelada correctamente.</p><div className="success-summary cancelled-summary"><div><span className="mini-course"><Icon name="book"/></span><div><small>CURSO</small><b>{course.name}</b><span>{course.language} · {course.level}</span></div><Badge tone="red">Cancelada</Badge></div><div className="success-info"><span><Icon name="calendar"/><small>FECHA<b>{course.date}</b></small></span><span><Icon name="clock"/><small>HORARIO<b>{course.time}</b></small></span></div></div><Notice kind="success">Cupo liberado: la clase ahora tiene {course.seats + 1} cupos disponibles.</Notice><div className="success-actions"><Button onClick={() => navigate("student-classes")} icon="calendar">Ver mis clases</Button><Button variant="secondary" onClick={() => navigate("history")}>Ver historial</Button></div></div></div>;
}

function NoSeats({ navigate }: { navigate: (s: Screen) => void }) {
  return <div className="center-page"><div className="success-card error-card"><Brand/><span className="error-icon"><Icon name="users" size={42}/></span><span className="eyebrow error-label">Clase completa</span><h1>No hay cupos disponibles para esta clase.</h1><p>Alemán para Viajes A2 alcanzó su capacidad máxima de 14 estudiantes. La reserva no puede completarse.</p><Notice kind="error">No se realizó ningún cargo ni reserva.</Notice><Button onClick={() => navigate("search")} icon="arrow">Volver a clases</Button></div></div>;
}

function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><span><Icon name={icon} size={32}/></span><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("student");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [confirmRole, setConfirmRole] = useState<Role>("student");
  const [localBookings, setLocalBookings] = useState<typeof availableClass[]>([]);
  const [newBooking, setNewBooking] = useState<string | null>(null);
  const [cancelledCourses, setCancelledCourses] = useState<typeof availableClass[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(availableClass);
  const [lastCancelledCourse, setLastCancelledCourse] = useState(availableClass);
  const navigate = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  async function confirmBooking() {
    if (!user || !selectedCourse.id) return;
    try {
      if (selectedCourse.id < 1000) {
        const created = await createReservation(user.id, selectedCourse.id);
        setNewBooking(`r:${created.id}`);
      } else {
        // Clase de demostración (no existe en el backend): solo se guarda en local
        setLocalBookings((current) => current.some((item) => item.id === selectedCourse.id) ? current : [...current, selectedCourse]);
        setNewBooking(`l:${selectedCourse.id}`);
      }
      setCancelledCourses((current) => current.filter((course) => course.name !== selectedCourse.name));
      navigate("booking-success");
    } catch (requestError) {
      window.alert(requestError instanceof Error ? requestError.message : "No fue posible reservar la clase.");
    }
  }
  async function cancelBookedCourse(course: typeof availableClass) {
    if (user && course.reservationId) {
      try {
        await cancelReservation(course.reservationId, user.id);
      } catch (requestError) {
        window.alert(requestError instanceof Error ? requestError.message : "No fue posible cancelar la reserva.");
        return;
      }
    }
    if (!course.reservationId) setLocalBookings((current) => current.filter((item) => item.id !== course.id));
    setCancelledCourses((current) => current.some((item) => item.name === course.name) ? current : [...current, course]);
    setLastCancelledCourse(course);
    navigate("cancellation-success");
  }
  const page = useMemo(() => {
    switch (screen) {
      case "login": return <Login navigate={navigate} setRole={setRole} setUser={setUser}/>;
      case "account-type": return <AccountType navigate={navigate}/>;
      case "student-register": return <Register role="student" navigate={navigate} setConfirmRole={setConfirmRole}/>;
      case "staff-register": return <Register role="staff" navigate={navigate} setConfirmRole={setConfirmRole}/>;
      case "language": return <Language navigate={navigate}/>;
      case "confirmation": return <Confirmation role={confirmRole} navigate={navigate}/>;
      case "student-dashboard": return user ? <StudentDashboard navigate={navigate} user={user} localBookings={localBookings} onSelect={(course) => { setSelectedCourse(course); navigate(course.seats ? "booking-detail" : "no-seats"); }}/> : <Login navigate={navigate} setRole={setRole} setUser={setUser}/>;
      case "staff-dashboard": return user ? <StaffDashboard navigate={navigate} user={user}/> : <Login navigate={navigate} setRole={setRole} setUser={setUser}/>;
      case "student-classes": return <StudentClasses navigate={navigate} localBookings={localBookings} newBooking={newBooking} clientId={user?.id || 0} onCancel={cancelBookedCourse} user={user}/>;
      case "staff-classes": return user ? <StaffClasses navigate={navigate} providerId={user.id} user={user}/> : <Login navigate={navigate} setRole={setRole} setUser={setUser}/>;
      case "staff-availability": return <StaffAvailability navigate={navigate} user={user}/>;
      case "history": return <History navigate={navigate} role={role} clientId={user?.id} user={user}/>;
      case "search": return <SearchClasses navigate={navigate} onSelect={setSelectedCourse} cancelledCourses={cancelledCourses} user={user}/>;
      case "booking-detail": return <BookingDetail navigate={navigate} course={selectedCourse} confirm={confirmBooking} user={user}/>;
      case "booking-success": return <BookingSuccess navigate={navigate} course={selectedCourse}/>;
      case "cancellation-success": return <CancellationSuccess navigate={navigate} course={lastCancelledCourse}/>;
      case "no-seats": return <NoSeats navigate={navigate}/>;
    }
  }, [screen, role, confirmRole, user, localBookings, newBooking, cancelledCourses, selectedCourse, lastCancelledCourse]);
  return page;
}
