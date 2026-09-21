# Terra Verde · Jardín & Eventos

Sitio web en Nuxt 3 con base de datos Supabase para el jardín de eventos
Terra Verde, Parramos, Chimaltenango.

## Requisitos

- Node.js 20 o superior (`node -v`)
- npm 10 o superior

## Puesta en marcha

```bash
npm install
npm run dev
```

Sitio público: http://localhost:3000
Panel de Jaime: http://localhost:3000/admin

El archivo `.env` ya viene con las credenciales de SMTP y Supabase.

## Antes del primer uso

1. Ejecutar `supabase-esquema.sql` en Supabase (SQL Editor > New query > Run)
2. Crear el usuario de Jaime en Supabase:
   Authentication > Users > Add user > Create new user
   Marcar la casilla "Auto Confirm User"

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Prueba local del build |

## Estructura

```
app.vue                              esqueleto general
nuxt.config.ts                       fuentes, CSS, variables de entorno
supabase-esquema.sql                 script de la base de datos

assets/css/main.css                  paleta, tipografías, animaciones
components/AppIcon.vue               iconos SVG (sin emojis)
components/TheHeader.vue             navegación del sitio público
components/TheFooter.vue             pie de página
components/sections/                 secciones de la portada
composables/useRevelar.ts            animación al hacer scroll
composables/useSupabase.ts           cliente público de Supabase

pages/index.vue                      portada
pages/admin/login.vue                acceso de Jaime
pages/admin/index.vue                panel con tabla de reservaciones

server/utils/supabase.ts             cliente de servidor
server/api/reservacion.post.ts       guarda la solicitud y manda el correo
server/api/fechas-ocupadas.get.ts    fechas no disponibles del calendario

public/images/hero-jardin.jpg        fotografía de la portada
public/images/galeria/               fotos de la galería (faltan)
```

## Imágenes pendientes

Colocar en `public/images/galeria/` seis fotos reales del jardín con los
nombres `jardin-01.jpg` hasta `jardin-06.jpg`, o editar la lista en
`components/sections/GaleriaLugar.vue`.

## Cómo funciona el flujo

1. El cliente llena el formulario y elige una fecha del calendario.
   Las fechas de eventos confirmados y las bloqueadas por Jaime salen tachadas.
2. El servidor guarda la solicitud en Supabase con estado `pendiente`.
3. El correo sale en segundo plano hacia terra.verde@outlook.es.
   Si falla, la reservación ya quedó guardada y el panel la marca en rojo.
4. Jaime entra a /admin, ve la tabla, cambia el estado y anota lo que necesite.
5. Al pasar una reservación a `confirmada`, esa fecha se bloquea sola
   en el calendario del sitio.

## Identidad visual

Verde bosque #315B2C · Dorado Terra #D99A32 · Marfil #FAF8F1 · Carbón #252525
Playfair Display (títulos) · Montserrat (texto) · Great Vibes (detalles)
