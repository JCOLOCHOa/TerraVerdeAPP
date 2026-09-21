import nodemailer from 'nodemailer'

interface Solicitud {
  fecha: string
  tipoEvento: string
  invitados: string
  nombre: string
  email: string
  telefono: string
  comentarios?: string
  sitioWeb?: string
}

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

function fechaLegible(iso: string) {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

function limpiar(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim()
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cuerpo = await readBody<Solicitud>(event)

  // 1. Campo trampa contra bots
  if (cuerpo.sitioWeb) {
    return { ok: true, mensaje: 'Solicitud recibida.' }
  }

  // 2. Validación en el servidor
  const faltantes: string[] = []
  if (!cuerpo.fecha) faltantes.push('fecha')
  if (!cuerpo.tipoEvento) faltantes.push('tipo de evento')
  if (!cuerpo.invitados) faltantes.push('invitados')
  if (!cuerpo.nombre?.trim()) faltantes.push('nombre')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cuerpo.email || '')) faltantes.push('correo')
  if ((cuerpo.telefono || '').replace(/\D/g, '').length < 8) faltantes.push('teléfono')

  if (faltantes.length) {
    throw createError({
      statusCode: 400,
      data: { ok: false, mensaje: `Revisa estos datos: ${faltantes.join(', ')}.` }
    })
  }

  const datos = {
    fecha: fechaLegible(cuerpo.fecha),
    tipo: limpiar(cuerpo.tipoEvento),
    invitados: limpiar(cuerpo.invitados),
    nombre: limpiar(cuerpo.nombre),
    email: limpiar(cuerpo.email),
    telefono: limpiar(cuerpo.telefono),
    comentarios: limpiar(cuerpo.comentarios) || 'Sin comentarios adicionales.'
  }

  // 3. Guardar en la base de datos ANTES de intentar el correo.
  //    Si el envío falla, la solicitud ya está a salvo.
  const db = supabaseServidor()

  const { data: guardada, error: errorDb } = await db
    .from('reservaciones')
    .insert({
      fecha_evento: cuerpo.fecha,
      tipo_evento: datos.tipo,
      invitados: Number(cuerpo.invitados),
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      comentarios: limpiar(cuerpo.comentarios) || null
    })
    .select('id')
    .single()

  if (errorDb) {
    console.error('[reservacion] fallo al guardar:', errorDb)
    throw createError({
      statusCode: 500,
      data: {
        ok: false,
        mensaje: 'No se pudo registrar la solicitud. Escríbenos al 4189-7550 por WhatsApp.'
      }
    })
  }

  // 4. Correo en segundo plano. El navegador no espera al servidor de correo.
  if (config.smtpUser && config.smtpPass) {
    const transporte = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 587,
      secure: Number(config.smtpPort) === 465,
      requireTLS: true,
      auth: { user: config.smtpUser, pass: config.smtpPass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000
    })

    const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#FAF8F1;padding:28px;color:#252525">
      <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #E8D8B8;border-radius:6px;overflow:hidden">
        <div style="background:#315B2C;padding:24px 28px">
          <p style="margin:0;color:#FAF8F1;font-size:20px;letter-spacing:1px">TERRA VERDE</p>
          <p style="margin:4px 0 0;color:#D99A32;font-size:12px;letter-spacing:2px">JARDIN &amp; EVENTOS</p>
        </div>
        <div style="padding:28px">
          <h2 style="margin:0 0 6px;color:#315B2C;font-size:19px">Nueva solicitud de reservación</h2>
          <p style="margin:0 0 22px;color:#657A3A;font-size:13px">Solicitud #${guardada.id} · enviada desde el sitio web</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:9px 0;border-bottom:1px solid #E8EEDB;width:38%"><b>Fecha solicitada</b></td><td style="padding:9px 0;border-bottom:1px solid #E8EEDB">${datos.fecha}</td></tr>
            <tr><td style="padding:9px 0;border-bottom:1px solid #E8EEDB"><b>Tipo de evento</b></td><td style="padding:9px 0;border-bottom:1px solid #E8EEDB">${datos.tipo}</td></tr>
            <tr><td style="padding:9px 0;border-bottom:1px solid #E8EEDB"><b>Invitados</b></td><td style="padding:9px 0;border-bottom:1px solid #E8EEDB">${datos.invitados}</td></tr>
            <tr><td style="padding:9px 0;border-bottom:1px solid #E8EEDB"><b>Nombre</b></td><td style="padding:9px 0;border-bottom:1px solid #E8EEDB">${datos.nombre}</td></tr>
            <tr><td style="padding:9px 0;border-bottom:1px solid #E8EEDB"><b>Correo</b></td><td style="padding:9px 0;border-bottom:1px solid #E8EEDB"><a href="mailto:${datos.email}" style="color:#B87920">${datos.email}</a></td></tr>
            <tr><td style="padding:9px 0;border-bottom:1px solid #E8EEDB"><b>Teléfono</b></td><td style="padding:9px 0;border-bottom:1px solid #E8EEDB"><a href="tel:${datos.telefono}" style="color:#B87920">${datos.telefono}</a></td></tr>
            <tr><td style="padding:9px 0;vertical-align:top"><b>Comentarios</b></td><td style="padding:9px 0">${datos.comentarios}</td></tr>
          </table>
        </div>
      </div>
    </div>`

    const texto = `Nueva solicitud de reservación (#${guardada.id})

Fecha solicitada: ${datos.fecha}
Tipo de evento: ${datos.tipo}
Invitados: ${datos.invitados}
Nombre: ${datos.nombre}
Correo: ${datos.email}
Teléfono: ${datos.telefono}
Comentarios: ${datos.comentarios}`

    transporte
      .sendMail({
        from: `"Sitio web Terra Verde" <${config.smtpUser}>`,
        to: config.mailTo || 'terra.verde@outlook.es',
        bcc: config.smtpUser,
        replyTo: `${datos.nombre} <${datos.email}>`,
        subject: `Reservación #${guardada.id}: ${datos.tipo} para el ${datos.fecha}`,
        text: texto,
        html
      })
      .then(async (info) => {
        console.log('[reservacion] correo enviado:', info.messageId)
        await db.from('reservaciones').update({ correo_enviado: true }).eq('id', guardada.id)
        transporte.close()
      })
      .catch((error) => {
        console.error('[reservacion] fallo al enviar correo:', error)
        transporte.close()
      })
  }

  return {
    ok: true,
    mensaje: `Recibimos tu solicitud para el ${datos.fecha}. Te responderemos al correo ${datos.email} en menos de 24 horas.`
  }
})
