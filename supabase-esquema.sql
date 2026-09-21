-- =====================================================================
-- Terra Verde · Esquema de base de datos
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabla: reservaciones
-- Cada solicitud enviada desde el formulario del sitio web
-- ---------------------------------------------------------------------
create table if not exists public.reservaciones (
  id             bigint generated always as identity primary key,
  fecha_evento   date        not null,
  tipo_evento    text        not null,
  invitados      integer     not null check (invitados > 0),
  nombre         text        not null,
  email          text        not null,
  telefono       text        not null,
  comentarios    text,
  estado         text        not null default 'pendiente'
                 check (estado in ('pendiente','cotizada','confirmada','cancelada')),
  correo_enviado boolean     not null default false,
  notas_internas text,
  creada_en      timestamptz not null default now()
);

create index if not exists idx_reservaciones_fecha  on public.reservaciones (fecha_evento);
create index if not exists idx_reservaciones_estado on public.reservaciones (estado);


-- ---------------------------------------------------------------------
-- Tabla: fechas_bloqueadas
-- Días que Jaime marca como no disponibles (mantenimiento, uso propio)
-- ---------------------------------------------------------------------
create table if not exists public.fechas_bloqueadas (
  id        bigint generated always as identity primary key,
  fecha     date not null unique,
  motivo    text,
  creada_en timestamptz not null default now()
);


-- =====================================================================
-- Seguridad a nivel de fila (RLS)
-- Sin esto, cualquiera con la clave pública podría leer los datos
-- de los clientes. Se activa en ambas tablas.
-- =====================================================================

alter table public.reservaciones     enable row level security;
alter table public.fechas_bloqueadas enable row level security;

-- Solo usuarios con sesión iniciada (Jaime) pueden ver y editar.
-- El sitio público escribe a través del servidor con la clave de servicio,
-- que ignora estas reglas por diseño.

drop policy if exists "admin lee reservaciones" on public.reservaciones;
create policy "admin lee reservaciones"
  on public.reservaciones for select
  to authenticated using (true);

drop policy if exists "admin edita reservaciones" on public.reservaciones;
create policy "admin edita reservaciones"
  on public.reservaciones for update
  to authenticated using (true) with check (true);

drop policy if exists "admin borra reservaciones" on public.reservaciones;
create policy "admin borra reservaciones"
  on public.reservaciones for delete
  to authenticated using (true);

drop policy if exists "admin gestiona fechas" on public.fechas_bloqueadas;
create policy "admin gestiona fechas"
  on public.fechas_bloqueadas for all
  to authenticated using (true) with check (true);


-- =====================================================================
-- Vista pública de disponibilidad
-- Devuelve solo las fechas ocupadas, sin datos personales de nadie.
-- Es lo único que el calendario del sitio necesita saber.
-- =====================================================================

create or replace view public.fechas_ocupadas as
  select fecha_evento as fecha from public.reservaciones
   where estado = 'confirmada'
  union
  select fecha from public.fechas_bloqueadas;

grant select on public.fechas_ocupadas to anon, authenticated;
