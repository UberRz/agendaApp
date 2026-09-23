import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "01_InicioSesion"
  | "02_TipoUsuario"
  | "03_RegistroUsuario"
  | "04_RegistroProveedor"
  | "05_TipoServicio"
  | "06_Confirmacion_Usuario"
  | "06_Confirmacion_Proveedor"
  | "07_PanelUsuario"
  | "08_PanelProveedor";

type UserType = "usuario" | "proveedor" | null;
type ServiceType = "clinica" | "consultorio" | "salon" | "deportivo" | "otro" | null;

// ─── Icon Components ──────────────────────────────────────────────────────────

function IconCalendar({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconUser({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconBriefcase({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function IconEye({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconCheck({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCheckCircle({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconAlertCircle({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconHospital({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="2" width="18" height="20" rx="1" />
      <path d="M9 22V12h6v10" />
      <path d="M12 7v4M10 9h4" />
    </svg>
  );
}

function IconStethoscope({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4.5 8.5a4 4 0 0 0 8 0V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4.5z" />
      <path d="M8.5 8.5A7 7 0 0 0 15.5 15.5" />
      <circle cx="18" cy="18" r="3" />
    </svg>
  );
}

function IconScissors({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

function IconDumbbell({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M6 4h4v4H6zM14 4h4v4h-4zM8 6h8M6 16h4v4H6zM14 16h4v4h-4zM8 18h8" />
      <line x1="12" y1="6" x2="12" y2="18" />
    </svg>
  );
}

function IconGrid({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconBell({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconSettings({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconArrowLeft({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconPhone({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.6 2.18H6.6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconLogOut({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function Logo({ size = "md", dark = false }: { size?: "sm" | "md" | "lg"; dark?: boolean }) {
  const textSize = size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base";
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-[#5B8DEF] flex items-center justify-center flex-shrink-0">
        <IconCalendar className="w-4 h-4 text-white" />
      </div>
      <span className={`font-bold tracking-tight ${textSize} ${dark ? "text-white" : "text-[#1A2B4A]"}`}>
        Agenda<span className="text-[#5B8DEF]">Fácil</span>
      </span>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 text-[#E85555] bg-[#FEF0F0] border border-[#E85555]/20 rounded-lg px-3 py-2.5 text-sm mt-1">
      <IconAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

function SuccessMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 text-[#3DB87A] bg-[#EDFAF3] border border-[#3DB87A]/20 rounded-lg px-3 py-2.5 text-sm mt-1">
      <IconCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  helper,
  error,
  icon,
  required = true,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#1A2B4A]">
        {label}
        {required && <span className="text-[#E85555] ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A93]">{icon}</div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border text-[#1A2B4A] text-sm bg-white placeholder:text-[#9BA8BB] outline-none transition-all focus:ring-2 focus:ring-[#5B8DEF]/30 focus:border-[#5B8DEF] ${
            error
              ? "border-[#E85555] bg-[#FEF0F0]"
              : "border-[#DDE4EF] hover:border-[#5B8DEF]/50"
          }`}
        />
      </div>
      {error && <ErrorMsg msg={error} />}
      {!error && helper && <p className="text-xs text-[#6B7A93] mt-0.5">{helper}</p>}
    </div>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  helper,
  required = true,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  helper?: string;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#1A2B4A]">
        {label}
        {required && <span className="text-[#E85555] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder || "••••••••"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-4 pr-12 py-3 rounded-xl border text-[#1A2B4A] text-sm bg-white placeholder:text-[#9BA8BB] outline-none transition-all focus:ring-2 focus:ring-[#5B8DEF]/30 focus:border-[#5B8DEF] ${
            error
              ? "border-[#E85555] bg-[#FEF0F0]"
              : "border-[#DDE4EF] hover:border-[#5B8DEF]/50"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A93] hover:text-[#5B8DEF] transition-colors"
          tabIndex={-1}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
      {error && <ErrorMsg msg={error} />}
      {!error && helper && <p className="text-xs text-[#6B7A93] mt-0.5">{helper}</p>}
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
  type = "button",
  full = true,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} bg-[#5B8DEF] hover:bg-[#4a7de0] active:bg-[#3a6dd0] disabled:bg-[#9BBAF8] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md text-sm tracking-wide`}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({
  children,
  onClick,
  full = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} bg-white hover:bg-[#F7F9FC] active:bg-[#EBF1FD] text-[#5B8DEF] font-semibold py-3.5 px-6 rounded-xl border border-[#5B8DEF]/30 hover:border-[#5B8DEF] transition-all duration-150 text-sm tracking-wide`}
    >
      {children}
    </button>
  );
}

function AppHeader({ onNavigate, isProvider = false }: { onNavigate: (s: Screen) => void; isProvider?: boolean }) {
  return (
    <header className="bg-white border-b border-[#DDE4EF] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6B7A93]">
          {isProvider ? (
            <>
              <a href="#" className="hover:text-[#5B8DEF] transition-colors">Mis Servicios</a>
              <a href="#" className="hover:text-[#5B8DEF] transition-colors">Reservas</a>
              <a href="#" className="hover:text-[#5B8DEF] transition-colors">Disponibilidad</a>
            </>
          ) : (
            <>
              <a href="#" className="hover:text-[#5B8DEF] transition-colors">Buscar</a>
              <a href="#" className="hover:text-[#5B8DEF] transition-colors">Mis Citas</a>
              <a href="#" className="hover:text-[#5B8DEF] transition-colors">Historial</a>
            </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg text-[#6B7A93] hover:text-[#5B8DEF] hover:bg-[#EBF1FD] transition-all">
            <IconBell />
          </button>
          <button className="p-2 rounded-lg text-[#6B7A93] hover:text-[#5B8DEF] hover:bg-[#EBF1FD] transition-all">
            <IconSettings />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#5B8DEF] flex items-center justify-center">
            <span className="text-white text-xs font-bold">{isProvider ? "P" : "U"}</span>
          </div>
          <button
            onClick={() => onNavigate("01_InicioSesion")}
            className="flex items-center gap-1.5 text-sm text-[#6B7A93] hover:text-[#E85555] transition-colors"
          >
            <IconLogOut className="w-4 h-4" />
            <span className="hidden md:block">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Screen 01: Login ─────────────────────────────────────────────────────────

function Screen01Login({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const VALID_USER = "demo";
  const VALID_PASS = "Demo@1234";
  const VALID_PROV = "proveedor";
  const VALID_PROV_PASS = "Prov@1234";

  const handleLogin = () => {
    if (username === VALID_USER && password === VALID_PASS) {
      onNavigate("07_PanelUsuario");
    } else if (username === VALID_PROV && password === VALID_PROV_PASS) {
      onNavigate("08_PanelProveedor");
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left panel */}
        <div className="bg-[#5B8DEF] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white" />
            <div className="absolute bottom-20 left-5 w-48 h-48 rounded-full bg-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#65C7A5]" />
          </div>
          <Logo dark size="lg" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white leading-tight mb-4">
              Organiza tus citas de forma fácil y segura
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Conectamos usuarios con proveedores de servicios para una experiencia de reserva sin complicaciones.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {["Reserva en segundos", "Gestión en tiempo real", "Historial completo"].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#65C7A5] flex items-center justify-center flex-shrink-0">
                    <IconCheck className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-6">
            <div className="bg-white/15 rounded-xl p-4">
              <p className="text-white/80 text-xs mb-2 font-medium">Credenciales de demo</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-white/90">
                <div>
                  <p className="font-semibold text-[#65C7A5]">Usuario</p>
                  <p>usuario: <span className="font-mono bg-white/10 px-1 rounded">demo</span></p>
                  <p>clave: <span className="font-mono bg-white/10 px-1 rounded">Demo@1234</span></p>
                </div>
                <div>
                  <p className="font-semibold text-[#65C7A5]">Proveedor</p>
                  <p>usuario: <span className="font-mono bg-white/10 px-1 rounded">proveedor</span></p>
                  <p>clave: <span className="font-mono bg-white/10 px-1 rounded">Prov@1234</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-[#1A2B4A] mb-1.5">Iniciar sesión</h1>
          <p className="text-sm text-[#6B7A93] mb-8">Ingresa tus credenciales para continuar.</p>

          {loginError && (
            <div className="mb-6 flex items-start gap-2.5 bg-[#FEF0F0] border border-[#E85555]/25 rounded-xl p-4">
              <IconAlertCircle className="w-5 h-5 text-[#E85555] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#E85555]">Credenciales incorrectas</p>
                <p className="text-sm text-[#E85555]/80 mt-0.5">El usuario o la contraseña no son válidos.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <InputField
              label="Nombre de usuario"
              placeholder="Ej. juan.garcia"
              value={username}
              onChange={(v) => { setUsername(v); setLoginError(false); }}
              error={loginError ? "" : undefined}
              icon={<IconUser className="w-4 h-4" />}
            />
            <PasswordField
              label="Contraseña"
              value={password}
              onChange={(v) => { setPassword(v); setLoginError(false); }}
              error={loginError ? "" : undefined}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <PrimaryBtn onClick={handleLogin}>Iniciar sesión</PrimaryBtn>
            <SecondaryBtn onClick={() => onNavigate("02_TipoUsuario")}>Crear una cuenta</SecondaryBtn>
          </div>

          <p className="text-center text-xs text-[#6B7A93] mt-6">
            ¿Nuevo en Agenda Fácil?{" "}
            <button
              onClick={() => onNavigate("02_TipoUsuario")}
              className="text-[#5B8DEF] font-medium hover:underline"
            >
              Crea tu cuenta gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 02: Select User Type ──────────────────────────────────────────────

function Screen02TipoUsuario({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<UserType>(null);
  const [error, setError] = useState(false);

  const handleContinue = () => {
    if (!selected) { setError(true); return; }
    onNavigate(selected === "usuario" ? "03_RegistroUsuario" : "04_RegistroProveedor");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <div className="bg-white border-b border-[#DDE4EF] px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <Logo />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#EBF1FD] text-[#5B8DEF] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span>Paso 1 de 3</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1A2B4A] mb-3">¿Qué tipo de cuenta necesitas?</h1>
            <p className="text-[#6B7A93]">Selecciona una opción para continuar con tu registro.</p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMsg msg="Selecciona un tipo de cuenta para continuar." />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Usuario card */}
            <button
              onClick={() => { setSelected("usuario"); setError(false); }}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 group ${
                selected === "usuario"
                  ? "border-[#5B8DEF] bg-[#EBF1FD] shadow-md"
                  : "border-[#DDE4EF] bg-white hover:border-[#5B8DEF]/50 hover:shadow-sm"
              }`}
              aria-pressed={selected === "usuario"}
            >
              {selected === "usuario" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#5B8DEF] flex items-center justify-center">
                  <IconCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                selected === "usuario" ? "bg-[#5B8DEF] text-white" : "bg-[#F7F9FC] text-[#5B8DEF] group-hover:bg-[#EBF1FD]"
              }`}>
                <IconUser className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${selected === "usuario" ? "text-[#5B8DEF]" : "text-[#1A2B4A]"}`}>
                Usuario
              </h3>
              <p className="text-sm text-[#6B7A93] leading-relaxed">
                Quiero reservar servicios y gestionar mis citas.
              </p>
            </button>

            {/* Proveedor card */}
            <button
              onClick={() => { setSelected("proveedor"); setError(false); }}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 group ${
                selected === "proveedor"
                  ? "border-[#65C7A5] bg-[#E8F7F2] shadow-md"
                  : "border-[#DDE4EF] bg-white hover:border-[#65C7A5]/50 hover:shadow-sm"
              }`}
              aria-pressed={selected === "proveedor"}
            >
              {selected === "proveedor" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#65C7A5] flex items-center justify-center">
                  <IconCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                selected === "proveedor" ? "bg-[#65C7A5] text-white" : "bg-[#F7F9FC] text-[#65C7A5] group-hover:bg-[#E8F7F2]"
              }`}>
                <IconBriefcase className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${selected === "proveedor" ? "text-[#65C7A5]" : "text-[#1A2B4A]"}`}>
                Proveedor
              </h3>
              <p className="text-sm text-[#6B7A93] leading-relaxed">
                Quiero ofrecer servicios y gestionar mis reservas.
              </p>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <PrimaryBtn onClick={handleContinue}>Continuar</PrimaryBtn>
            <SecondaryBtn onClick={() => onNavigate("01_InicioSesion")}>
              <span className="flex items-center justify-center gap-2">
                <IconArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </span>
            </SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Registration Form ─────────────────────────────────────────────────

type RegState = {
  nombre: string;
  email: string;
  username: string;
  password: string;
  telefono: string;
  negocio?: string;
};

type RegErrors = Partial<Record<keyof RegState | "general", string>>;
type RegSuccess = { show: boolean };

// Simulate taken emails/usernames
const TAKEN_EMAILS = ["admin@agendafacil.com", "test@test.com", "correoexistente@ejemplo.com"];
const TAKEN_USERNAMES = ["admin", "superuser", "demo", "proveedor", "usuarioexistente"];

function validatePassword(p: string): string | undefined {
  if (!p) return "La contraseña debe tener mínimo 8 caracteres y al menos un símbolo.";
  if (p.length < 8 || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)) {
    return "La contraseña debe tener mínimo 8 caracteres y al menos un símbolo.";
  }
  return undefined;
}

// ─── Screen 03: User Registration ────────────────────────────────────────────

function Screen03RegistroUsuario({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [f, setF] = useState<RegState>({ nombre: "", email: "", username: "", password: "", telefono: "" });
  const [errors, setErrors] = useState<RegErrors>({});
  const [success, setSuccess] = useState<RegSuccess>({ show: false });

  const update = (k: keyof RegState) => (v: string) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined, general: undefined }));
  };

  // While a duplicate email/username is present, registration must be blocked.
  const emailTaken = TAKEN_EMAILS.includes(f.email.trim().toLowerCase());
  const usernameTaken = TAKEN_USERNAMES.includes(f.username.trim().toLowerCase());
  const blocked = emailTaken || usernameTaken;

  const handleSubmit = () => {
    const e: RegErrors = {};
    if (!f.nombre.trim()) e.nombre = "El nombre completo es obligatorio.";
    if (!f.email.trim()) e.email = "El correo electrónico es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Utiliza un correo electrónico válido.";
    else if (TAKEN_EMAILS.includes(f.email.toLowerCase())) e.email = "Este correo electrónico ya está registrado. Utiliza otro correo.";
    if (!f.username.trim()) e.username = "El nombre de usuario es obligatorio.";
    else if (TAKEN_USERNAMES.includes(f.username.toLowerCase())) e.username = "Este nombre de usuario ya está registrado. Elige otro.";
    const pwErr = validatePassword(f.password);
    if (pwErr) e.password = pwErr;
    if (!f.telefono.trim()) e.telefono = "El número telefónico es obligatorio.";
    if (Object.keys(e).length > 0) {
      setErrors({ ...e, general: "Completa todos los campos obligatorios para continuar." });
      return;
    }
    setSuccess({ show: true });
  };

  if (success.show) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <div className="bg-white border-b border-[#DDE4EF] px-6 py-4">
          <div className="max-w-xl mx-auto"><Logo /></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-[#EDFAF3] flex items-center justify-center mx-auto mb-6">
              <IconCheckCircle className="w-10 h-10 text-[#3DB87A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A2B4A] mb-2">¡Cuenta creada con éxito!</h2>
            <p className="text-[#6B7A93] mb-8">Tu registro se completó correctamente. Ya puedes empezar a reservar servicios.</p>
            <PrimaryBtn onClick={() => onNavigate("06_Confirmacion_Usuario")}>Continuar</PrimaryBtn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <div className="bg-white border-b border-[#DDE4EF] px-6 py-4">
        <div className="max-w-xl mx-auto"><Logo /></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#EBF1FD] text-[#5B8DEF] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span>Paso 2 de 3</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1A2B4A] mb-2">Crea tu cuenta</h1>
            <p className="text-[#6B7A93]">Ingresa tus datos para comenzar a utilizar Agenda Fácil.</p>
          </div>

          {errors.general && (
            <div className="mb-6">
              <ErrorMsg msg={errors.general} />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-[#DDE4EF] p-8 flex flex-col gap-5">
            <InputField label="Nombre completo" placeholder="Ej. Juan García López" value={f.nombre} onChange={update("nombre")} error={errors.nombre} icon={<IconUser className="w-4 h-4" />} />
            <InputField label="Correo electrónico" type="email" placeholder="ejemplo@correo.com" value={f.email} onChange={update("email")} error={errors.email} helper="Utiliza un correo electrónico válido." icon={<IconMail className="w-4 h-4" />} />
            <InputField label="Nombre de usuario" placeholder="juangarcia" value={f.username} onChange={update("username")} error={errors.username} helper="El nombre de usuario debe ser único." />
            <PasswordField label="Contraseña" value={f.password} onChange={update("password")} error={errors.password} helper="Mínimo 8 caracteres y al menos un símbolo." />
            <InputField label="Número telefónico" type="tel" placeholder="+1 (555) 123-4567" value={f.telefono} onChange={update("telefono")} error={errors.telefono} icon={<IconPhone className="w-4 h-4" />} />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <PrimaryBtn onClick={handleSubmit} disabled={blocked}>Crear cuenta</PrimaryBtn>
            {blocked && (
              <p className="text-xs text-[#E85555] text-center -mt-1">
                No es posible completar el registro con {emailTaken ? "este correo" : "este nombre de usuario"}.
              </p>
            )}
            <SecondaryBtn onClick={() => onNavigate("02_TipoUsuario")}>
              <span className="flex items-center justify-center gap-2">
                <IconArrowLeft className="w-4 h-4" />
                Volver
              </span>
            </SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 04: Provider Registration ────────────────────────────────────────

function Screen04RegistroProveedor({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [f, setF] = useState<RegState>({ nombre: "", email: "", username: "", password: "", telefono: "", negocio: "" });
  const [errors, setErrors] = useState<RegErrors>({});

  const update = (k: keyof RegState) => (v: string) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined, general: undefined }));
  };

  const handleSubmit = () => {
    const e: RegErrors = {};
    if (!f.nombre.trim()) e.nombre = "El nombre completo es obligatorio.";
    if (!f.email.trim()) e.email = "El correo electrónico es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Utiliza un correo electrónico válido.";
    else if (TAKEN_EMAILS.includes(f.email.toLowerCase())) e.email = "Este correo electrónico ya está registrado. Utiliza otro correo.";
    if (!f.username.trim()) e.username = "El nombre de usuario es obligatorio.";
    else if (TAKEN_USERNAMES.includes(f.username.toLowerCase())) e.username = "Este nombre de usuario ya está registrado. Elige otro.";
    const pwErr = validatePassword(f.password);
    if (pwErr) e.password = pwErr;
    if (!f.telefono.trim()) e.telefono = "El número telefónico es obligatorio.";
    if (!f.negocio?.trim()) e.negocio = "El nombre del negocio es obligatorio.";
    if (Object.keys(e).length > 0) {
      setErrors({ ...e, general: "Completa todos los campos obligatorios para continuar." });
      return;
    }
    onNavigate("05_TipoServicio");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <div className="bg-white border-b border-[#DDE4EF] px-6 py-4">
        <div className="max-w-xl mx-auto"><Logo /></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#E8F7F2] text-[#65C7A5] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span>Paso 2 de 4</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1A2B4A] mb-2">Registra tu negocio</h1>
            <p className="text-[#6B7A93]">Completa tus datos para comenzar a ofrecer servicios.</p>
          </div>

          {errors.general && (
            <div className="mb-6">
              <ErrorMsg msg={errors.general} />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-[#DDE4EF] p-8 flex flex-col gap-5">
            <InputField label="Nombre completo" placeholder="Ej. María Torres" value={f.nombre} onChange={update("nombre")} error={errors.nombre} icon={<IconUser className="w-4 h-4" />} />
            <InputField label="Correo electrónico" type="email" placeholder="negocio@correo.com" value={f.email} onChange={update("email")} error={errors.email} helper="Utiliza un correo electrónico válido." icon={<IconMail className="w-4 h-4" />} />
            <InputField label="Nombre de usuario" placeholder="mi_negocio" value={f.username} onChange={update("username")} error={errors.username} helper="El nombre de usuario debe ser único." />
            <PasswordField label="Contraseña" value={f.password} onChange={update("password")} error={errors.password} helper="Mínimo 8 caracteres y al menos un símbolo." />
            <InputField label="Número telefónico" type="tel" placeholder="+1 (555) 123-4567" value={f.telefono} onChange={update("telefono")} error={errors.telefono} icon={<IconPhone className="w-4 h-4" />} />
            <InputField label="Nombre del negocio" placeholder="Ej. Clínica Central, Salón Bella Vista" value={f.negocio || ""} onChange={update("negocio")} error={errors.negocio} />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <PrimaryBtn onClick={handleSubmit}>Continuar</PrimaryBtn>
            <SecondaryBtn onClick={() => onNavigate("02_TipoUsuario")}>
              <span className="flex items-center justify-center gap-2">
                <IconArrowLeft className="w-4 h-4" />
                Volver
              </span>
            </SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 05: Service Type ──────────────────────────────────────────────────

const SERVICE_OPTIONS: { id: ServiceType; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "clinica", label: "Clínica", desc: "Atención médica y cuidados de salud.", icon: <IconHospital /> },
  { id: "consultorio", label: "Consultorio", desc: "Consultas profesionales especializadas.", icon: <IconStethoscope /> },
  { id: "salon", label: "Salón de belleza", desc: "Servicios de estética y belleza.", icon: <IconScissors /> },
  { id: "deportivo", label: "Centro deportivo", desc: "Instalaciones deportivas y fitness.", icon: <IconDumbbell /> },
  { id: "otro", label: "Otro", desc: "Cualquier otro tipo de servicio.", icon: <IconGrid /> },
];

function Screen05TipoServicio({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<ServiceType>(null);
  const [error, setError] = useState(false);

  const handleContinue = () => {
    if (!selected) { setError(true); return; }
    onNavigate("06_Confirmacion_Proveedor");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <div className="bg-white border-b border-[#DDE4EF] px-6 py-4">
        <div className="max-w-2xl mx-auto"><Logo /></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#E8F7F2] text-[#65C7A5] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span>Paso 3 de 4</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1A2B4A] mb-3">¿Qué tipo de servicio ofreces?</h1>
            <p className="text-[#6B7A93]">Selecciona una categoría para clasificar tu servicio.</p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMsg msg="Selecciona un tipo de servicio para continuar." />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {SERVICE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setSelected(opt.id); setError(false); }}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${
                  selected === opt.id
                    ? "border-[#65C7A5] bg-[#E8F7F2] shadow-md"
                    : "border-[#DDE4EF] bg-white hover:border-[#65C7A5]/50 hover:shadow-sm"
                }`}
                aria-pressed={selected === opt.id}
              >
                {selected === opt.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#65C7A5] flex items-center justify-center">
                    <IconCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  selected === opt.id ? "bg-[#65C7A5] text-white" : "bg-[#F7F9FC] text-[#65C7A5] group-hover:bg-[#E8F7F2]"
                }`}>
                  {opt.icon}
                </div>
                <h3 className={`font-bold mb-1 text-sm ${selected === opt.id ? "text-[#2d9e7a]" : "text-[#1A2B4A]"}`}>
                  {opt.label}
                </h3>
                <p className="text-xs text-[#6B7A93] leading-relaxed">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <PrimaryBtn onClick={handleContinue}>Continuar</PrimaryBtn>
            <SecondaryBtn onClick={() => onNavigate("04_RegistroProveedor")}>
              <span className="flex items-center justify-center gap-2">
                <IconArrowLeft className="w-4 h-4" />
                Volver
              </span>
            </SecondaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 06: Confirmation ──────────────────────────────────────────────────

function Screen06Confirmacion({ onNavigate, isProvider }: { onNavigate: (s: Screen) => void; isProvider: boolean }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <div className="bg-white border-b border-[#DDE4EF] px-6 py-4">
        <div className="max-w-xl mx-auto"><Logo /></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-[#DDE4EF] p-12 max-w-lg w-full text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isProvider ? "bg-[#E8F7F2]" : "bg-[#EDFAF3]"}`}>
            <IconCheckCircle className={`w-12 h-12 ${isProvider ? "text-[#65C7A5]" : "text-[#3DB87A]"}`} />
          </div>

          <h1 className="text-3xl font-bold text-[#1A2B4A] mb-3">
            {isProvider ? "¡Registro completado!" : "¡Tu cuenta está lista!"}
          </h1>
          <p className="text-[#6B7A93] mb-2 leading-relaxed">
            {isProvider
              ? "Tu cuenta y tipo de servicio fueron registrados correctamente."
              : "Tu registro se completó correctamente."}
          </p>
          <p className="text-sm text-[#6B7A93] mb-10">
            Ahora puedes iniciar sesión y {isProvider ? "comenzar a gestionar tus reservas" : "empezar a reservar servicios"}.
          </p>

          <div className={`rounded-xl p-4 mb-8 ${isProvider ? "bg-[#E8F7F2]" : "bg-[#EBF1FD]"}`}>
            <p className={`text-sm font-semibold mb-1 ${isProvider ? "text-[#2d9e7a]" : "text-[#5B8DEF]"}`}>
              Pasos completados:
            </p>
            {[
              "Selección de tipo de cuenta",
              isProvider ? "Datos del negocio registrados" : "Información personal registrada",
              ...(isProvider ? ["Tipo de servicio seleccionado"] : []),
            ].map((s) => (
              <div key={s} className="flex items-center gap-2 mt-1.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isProvider ? "bg-[#65C7A5]" : "bg-[#5B8DEF]"}`}>
                  <IconCheck className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm text-[#1A2B4A]">{s}</span>
              </div>
            ))}
          </div>

          <PrimaryBtn onClick={() => onNavigate("01_InicioSesion")}>
            Ir al inicio de sesión
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 07: User Dashboard ────────────────────────────────────────────────

const SERVICES_CARDS = [
  { name: "Clínica Central", cat: "Clínica", rating: 4.8, reviews: 124, time: "L-V 8am-6pm", img: "photo-1519494026892-80bbd2d6fd0d" },
  { name: "Salón Bella Vista", cat: "Belleza", rating: 4.9, reviews: 87, time: "Mar-Dom 9am-7pm", img: "photo-1560066984-138dadb4c035" },
  { name: "FitCenter Plus", cat: "Deportivo", rating: 4.7, reviews: 203, time: "L-D 6am-10pm", img: "photo-1534438327276-14e5300c3a48" },
];

const UPCOMING = [
  { service: "Clínica Central", date: "Mié 11 Sep, 10:30 AM", status: "Confirmada", color: "#3DB87A" },
  { service: "Salón Bella Vista", date: "Vie 13 Sep, 3:00 PM", status: "Pendiente", color: "#F5A623" },
];

function Screen07PanelUsuario({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AppHeader onNavigate={onNavigate} />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A2B4A]">Bienvenido a Agenda Fácil</h1>
          <p className="text-[#6B7A93] mt-1">Encuentra y reserva servicios de forma rápida y sencilla.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Citas activas", value: "2", color: "#5B8DEF", bg: "#EBF1FD" },
            { label: "Historial", value: "12", color: "#65C7A5", bg: "#E8F7F2" },
            { label: "Proveedores fav.", value: "5", color: "#F5A623", bg: "#FEF8EC" },
            { label: "Este mes", value: "3", color: "#9B59B6", bg: "#F5EEF8" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#DDE4EF] p-4 flex flex-col gap-1 shadow-sm">
              <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
              <span className="text-xs text-[#6B7A93] font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search + services */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Search */}
            <div className="bg-white rounded-2xl border border-[#DDE4EF] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1A2B4A] mb-4">Buscar servicios</h2>
              <div className="relative mb-4">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A93]">
                  <IconSearch />
                </div>
                <input
                  type="text"
                  placeholder="Buscar clínicas, salones, gimnasios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDE4EF] text-sm text-[#1A2B4A] placeholder:text-[#9BA8BB] outline-none focus:ring-2 focus:ring-[#5B8DEF]/30 focus:border-[#5B8DEF]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {["Clínica", "Belleza", "Deportivo", "Consultorio"].map((c) => (
                  <button key={c} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#EBF1FD] text-[#5B8DEF] hover:bg-[#5B8DEF] hover:text-white transition-all">
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Service cards */}
            <div>
              <h2 className="text-lg font-bold text-[#1A2B4A] mb-4">Servicios disponibles</h2>
              <div className="flex flex-col gap-4">
                {SERVICES_CARDS.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.cat.toLowerCase().includes(search.toLowerCase())).map((s) => (
                  <div key={s.name} className="bg-white rounded-2xl border border-[#DDE4EF] overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-shadow group">
                    <div className="sm:w-32 h-32 sm:h-auto bg-[#DDE4EF] flex-shrink-0 overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/${s.img}?w=200&h=150&fit=crop&auto=format`}
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#EBF1FD] text-[#5B8DEF]">{s.cat}</span>
                        </div>
                        <h3 className="font-bold text-[#1A2B4A] text-sm">{s.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <IconStar className="w-3.5 h-3.5 text-[#F5A623]" />
                          <span className="text-xs font-medium text-[#1A2B4A]">{s.rating}</span>
                          <span className="text-xs text-[#6B7A93]">({s.reviews} reseñas)</span>
                        </div>
                        <p className="text-xs text-[#6B7A93] mt-1">{s.time}</p>
                      </div>
                      <button className="mt-3 self-start text-xs font-semibold bg-[#5B8DEF] hover:bg-[#4a7de0] text-white px-4 py-1.5 rounded-lg transition-colors">
                        Reservar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Upcoming */}
            <div className="bg-white rounded-2xl border border-[#DDE4EF] p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#1A2B4A] mb-4">Próximas citas</h2>
              {UPCOMING.map((u) => (
                <div key={u.service} className="flex gap-3 mb-3 last:mb-0">
                  <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: u.color }} />
                  <div>
                    <p className="text-sm font-medium text-[#1A2B4A]">{u.service}</p>
                    <p className="text-xs text-[#6B7A93]">{u.date}</p>
                    <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${u.color}20`, color: u.color }}>
                      {u.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl border border-[#DDE4EF] p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#1A2B4A] mb-4">Historial de reservaciones</h2>
              {[
                { service: "FitCenter Plus", date: "3 Sep, 2026", status: "Completada" },
                { service: "Clínica Central", date: "28 Ago, 2026", status: "Completada" },
                { service: "Salón Bella Vista", date: "20 Ago, 2026", status: "Cancelada" },
              ].map((h) => (
                <div key={h.date} className="flex items-center justify-between py-2 border-b border-[#F0F3F8] last:border-0">
                  <div>
                    <p className="text-xs font-medium text-[#1A2B4A]">{h.service}</p>
                    <p className="text-xs text-[#6B7A93]">{h.date}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${h.status === "Completada" ? "bg-[#EDFAF3] text-[#3DB87A]" : "bg-[#FEF0F0] text-[#E85555]"}`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Screen 08: Provider Dashboard ───────────────────────────────────────────

function Screen08PanelProveedor({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <AppHeader onNavigate={onNavigate} isProvider />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A2B4A]">Panel del proveedor</h1>
            <p className="text-[#6B7A93] mt-1">Gestiona tus servicios, reservas y disponibilidad.</p>
          </div>
          <button className="self-start sm:self-auto bg-[#65C7A5] hover:bg-[#52b894] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors">
            + Nuevo servicio
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Reservas hoy", value: "8", color: "#5B8DEF", bg: "#EBF1FD" },
            { label: "Este mes", value: "47", color: "#65C7A5", bg: "#E8F7F2" },
            { label: "Servicios activos", value: "3", color: "#F5A623", bg: "#FEF8EC" },
            { label: "Valoración", value: "4.8★", color: "#9B59B6", bg: "#F5EEF8" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#DDE4EF] p-4 shadow-sm">
              <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
              <p className="text-xs text-[#6B7A93] font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Mis servicios */}
            <div className="bg-white rounded-2xl border border-[#DDE4EF] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1A2B4A] mb-4">Mis servicios</h2>
              <div className="flex flex-col gap-4">
                {[
                  { name: "Consulta General", cat: "Clínica", avail: "Disponible", reservas: 12, img: "photo-1519494026892-80bbd2d6fd0d" },
                  { name: "Examen de Rutina", cat: "Clínica", avail: "Ocupado", reservas: 8, img: "photo-1581595220892-b0739db3ba8c" },
                  { name: "Limpieza Dental", cat: "Clínica", avail: "Disponible", reservas: 15, img: "photo-1606811971618-4486d14f3f99" },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F9FC] border border-[#DDE4EF] hover:border-[#65C7A5]/50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#DDE4EF]">
                      <img
                        src={`https://images.unsplash.com/${svc.img}?w=100&h=100&fit=crop&auto=format`}
                        alt={svc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#1A2B4A]">{svc.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBF1FD] text-[#5B8DEF] font-medium">{svc.cat}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${svc.avail === "Disponible" ? "bg-[#EDFAF3] text-[#3DB87A]" : "bg-[#FEF8EC] text-[#F5A623]"}`}>
                          {svc.avail}
                        </span>
                        <span className="text-xs text-[#6B7A93]">{svc.reservas} reservas</span>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-[#5B8DEF] hover:text-[#4a7de0] opacity-0 group-hover:opacity-100 transition-opacity">
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="bg-white rounded-2xl border border-[#DDE4EF] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1A2B4A] mb-4">Disponibilidad — Semana actual</h2>
              <div className="grid grid-cols-7 gap-1">
                {["L", "M", "Mi", "J", "V", "S", "D"].map((d, i) => (
                  <div key={d} className="text-center">
                    <p className="text-xs text-[#6B7A93] font-medium mb-1">{d}</p>
                    <div className={`h-10 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${
                      [0, 1, 2, 3, 4].includes(i)
                        ? "bg-[#EDFAF3] text-[#3DB87A] hover:bg-[#65C7A5] hover:text-white"
                        : "bg-[#F0F3F8] text-[#9BA8BB]"
                    }`}>
                      {[0,1,2,3,4].includes(i) ? "✓" : "–"}
                    </div>
                    <p className="text-xs text-[#9BA8BB] mt-1">{7 + i}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-[#DDE4EF] p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#1A2B4A] mb-4">Próximas reservas</h2>
              {[
                { patient: "Carlos Méndez", service: "Consulta General", time: "10:30 AM", status: "Confirmada" },
                { patient: "Ana Ruiz", service: "Limpieza Dental", time: "11:00 AM", status: "Confirmada" },
                { patient: "Luis Torres", service: "Examen de Rutina", time: "2:00 PM", status: "Pendiente" },
                { patient: "María López", service: "Consulta General", time: "3:30 PM", status: "Confirmada" },
              ].map((r) => (
                <div key={`${r.patient}-${r.time}`} className="flex items-start gap-3 py-3 border-b border-[#F0F3F8] last:border-0">
                  <div className="w-7 h-7 rounded-full bg-[#EBF1FD] flex items-center justify-center text-[#5B8DEF] text-xs font-bold flex-shrink-0">
                    {r.patient[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1A2B4A]">{r.patient}</p>
                    <p className="text-xs text-[#6B7A93]">{r.service}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-[#5B8DEF] font-medium">{r.time}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${r.status === "Confirmada" ? "bg-[#EDFAF3] text-[#3DB87A]" : "bg-[#FEF8EC] text-[#F5A623]"}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-[#5B8DEF] to-[#65C7A5] rounded-2xl p-5 text-white shadow-md">
              <h2 className="font-bold mb-3">Resumen de reservas</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Completadas", val: "34", pct: 72 },
                  { label: "Pendientes", val: "8", pct: 17 },
                  { label: "Canceladas", val: "5", pct: 11 },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1 text-white/90">
                      <span>{r.label}</span>
                      <span className="font-semibold">{r.val}</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/70 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("01_InicioSesion");

  const navigate = (s: Screen) => setScreen(s);

  return (
    <div className="font-[Inter,system-ui,sans-serif] min-h-screen">
      {screen === "01_InicioSesion" && <Screen01Login onNavigate={navigate} />}
      {screen === "02_TipoUsuario" && <Screen02TipoUsuario onNavigate={navigate} />}
      {screen === "03_RegistroUsuario" && <Screen03RegistroUsuario onNavigate={navigate} />}
      {screen === "04_RegistroProveedor" && <Screen04RegistroProveedor onNavigate={navigate} />}
      {screen === "05_TipoServicio" && <Screen05TipoServicio onNavigate={navigate} />}
      {screen === "06_Confirmacion_Usuario" && <Screen06Confirmacion onNavigate={navigate} isProvider={false} />}
      {screen === "06_Confirmacion_Proveedor" && <Screen06Confirmacion onNavigate={navigate} isProvider={true} />}
      {screen === "07_PanelUsuario" && <Screen07PanelUsuario onNavigate={navigate} />}
      {screen === "08_PanelProveedor" && <Screen08PanelProveedor onNavigate={navigate} />}
    </div>
  );
}
