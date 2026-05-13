const functions = require("firebase-functions");
const functionsV1 = require("firebase-functions/v1");
const { defineSecret, defineString } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const NOTIFICATIONS_FROM_EMAIL = defineString("NOTIFICATIONS_FROM_EMAIL", {
  default: "noreply@clubdeportivovikingas.cl"
});
const NOTIFICATIONS_FROM_NAME = defineString("NOTIFICATIONS_FROM_NAME", {
  default: "CD Vikingas"
});

const SITE_URL = "https://www.clubdeportivovikingas.cl";
const ENTRENAMIENTOS_URL = `${SITE_URL}/entrenamientos`;
const LOGIN_JUGADORA_URL = `${SITE_URL}/login-jugadora`;

const normalizarCategoriaEquipo = (valor = "") => {
  const normalizado = valor
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");

  if (["seriec", "seriec2026", "seriec2025"].includes(normalizado)) return "serieC";
  if (["ascenso", "escuela", "ambos"].includes(normalizado)) return normalizado;
  return valor;
};

const pertenecePorEquipo = (jugadora = {}, equipo = "") => {
  const equipoObjetivo = normalizarCategoriaEquipo(equipo);
  if (!equipoObjetivo) return false;

  if (equipoObjetivo === "ambos") {
    return true;
  }

  if (Array.isArray(jugadora.equipos)) {
    return jugadora.equipos.map(normalizarCategoriaEquipo).includes(equipoObjetivo);
  }

  const equipoJugadora = normalizarCategoriaEquipo(jugadora.equipo);
  if (equipoObjetivo === "ascenso") {
    return equipoJugadora === "ascenso" || equipoJugadora === "ambos";
  }
  if (equipoObjetivo === "escuela") {
    return equipoJugadora === "escuela" || equipoJugadora === "ambos";
  }
  if (equipoObjetivo === "serieC") {
    return equipoJugadora === "serieC";
  }

  return false;
};

const leerConfigCorreo = () => ({
  resendApiKey: process.env.RESEND_API_KEY || "",
  fromEmail: process.env.NOTIFICATIONS_FROM_EMAIL || NOTIFICATIONS_FROM_EMAIL.value() || "noreply@clubdeportivovikingas.cl",
  fromName: process.env.NOTIFICATIONS_FROM_NAME || NOTIFICATIONS_FROM_NAME.value() || "CD Vikingas"
});

const obtenerFechaEntrenamiento = (fecha) => {
  if (!fecha) return null;
  if (typeof fecha?.toDate === "function") return fecha.toDate();
  if (fecha?._seconds) return new Date(fecha._seconds * 1000);
  if (fecha?.seconds) return new Date(fecha.seconds * 1000);

  const date = new Date(fecha);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatearFechaEntrenamiento = (fecha) => {
  const date = obtenerFechaEntrenamiento(fecha);
  if (!date) return "Fecha por confirmar";

  return new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
};

const escaparHtml = (valor = "") => valor
  .toString()
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#39;");

const construirContenidoCorreo = (entrenamiento = {}, modo = "nuevo") => {
  const esRecordatorio = modo === "recordatorio";
  const nombre = (entrenamiento.nombre || "Nuevo entrenamiento").toString().trim();
  const tipo = (entrenamiento.tipo || "entrenamiento").toString().trim();
  const rival = (entrenamiento.rival || "").toString().trim();
  const lugar = (entrenamiento.lugar || "Lugar por confirmar").toString().trim();
  const hora = (entrenamiento.hora || "Horario por confirmar").toString().trim();
  const descripcion = (entrenamiento.descripcion || "").toString().trim();
  const fecha = formatearFechaEntrenamiento(entrenamiento.fecha);
  const encabezadoTipo = tipo === "partido" || tipo === "amistoso"
    ? `${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}${rival ? ` vs ${rival}` : ""}`
    : `${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`;

  const subject = esRecordatorio
    ? `Recordatorio ${tipo}: ${nombre}`
    : `Nuevo ${tipo}: ${nombre}`;
  const text = [
    `Hola,`,
    "",
    esRecordatorio
      ? `Te recordamos este ${tipo} de CD Vikingas para que confirmes tu asistencia.`
      : `Se abrió un nuevo ${tipo} para anotarse en CD Vikingas.`,
    `Actividad: ${nombre}`,
    `Detalle: ${encabezadoTipo}`,
    `Fecha: ${fecha}`,
    `Hora: ${hora}`,
    `Lugar: ${lugar}`,
    descripcion ? `Descripción: ${descripcion}` : null,
    "",
    `Ingresa a ${LOGIN_JUGADORA_URL} para acceder y revisar tus entrenamientos.`,
    `Luego puedes entrar directo a ${ENTRENAMIENTOS_URL} para confirmar asistencia.`,
    "",
    "CD Vikingas"
  ].filter(Boolean).join("\n");

  const html = `
    <div style="background:#f7f4ec;padding:32px 16px;font-family:Arial,sans-serif;color:#1f2937;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5dcc8;border-radius:20px;overflow:hidden;box-shadow:0 20px 45px rgba(15,23,42,0.08);">
        <div style="background:linear-gradient(135deg,#0f172a 0%,#0ea5a4 100%);padding:28px 32px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.82;font-weight:700;">CD Vikingas</div>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.1;">${esRecordatorio ? "Recordatorio de asistencia" : `Nuevo ${escaparHtml(tipo)} disponible`}</h1>
          <p style="margin:10px 0 0;font-size:15px;line-height:1.6;opacity:0.92;max-width:480px;">${esRecordatorio ? "Todavía estás a tiempo de revisar el evento y confirmar tu asistencia." : "Ya puedes ingresar y confirmar tu asistencia."}</p>
        </div>
        <div style="padding:28px 32px;">
          <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#f6e7b0;color:#6b4f12;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">${escaparHtml(encabezadoTipo)}</div>
          <h2 style="margin:18px 0 12px;font-size:24px;line-height:1.2;color:#111827;">${escaparHtml(nombre)}</h2>
          <div style="margin:0 0 18px;padding:18px;border-radius:16px;background:#faf8f2;border:1px solid #eadfca;">
            <p style="margin:0 0 10px;font-size:15px;"><strong>Fecha:</strong> ${escaparHtml(fecha)}</p>
            <p style="margin:0 0 10px;font-size:15px;"><strong>Hora:</strong> ${escaparHtml(hora)}</p>
            <p style="margin:0;font-size:15px;"><strong>Lugar:</strong> ${escaparHtml(lugar)}</p>
          </div>
          ${descripcion ? `<p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#4b5563;">${escaparHtml(descripcion)}</p>` : ""}
          <div style="margin:24px 0;">
            <a href="${ENTRENAMIENTOS_URL}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700;">Ver entrenamientos</a>
          </div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">Si todavía no has iniciado sesión, entra primero en <a href="${LOGIN_JUGADORA_URL}" style="color:#8a6a24;">Acceso Jugadoras</a> y luego confirma tu asistencia.</p>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
};

const serializarErrorCorreo = (error) => {
  if (!error) return "Error desconocido";
  if (typeof error === "string") return error;
  if (error.message) return error.message;

  try {
    return JSON.stringify(error);
  } catch (jsonError) {
    return String(error);
  }
};

const obtenerDestinatariasEntrenamiento = async (equipo) => {
  const db = admin.firestore();
  const [registroSnapshot, loginSnapshot, accesoSnapshot] = await Promise.all([
    db.collection("jugadoraRegistro").get(),
    db.collection("jugadorasLogin").get(),
    db.collection("jugadoras").get()
  ]);

  const emailsLoginPorId = new Map(
    loginSnapshot.docs.map((docSnap) => [docSnap.id, (docSnap.data()?.email || "").toString().trim()])
  );
  const emailsAccesoPorId = new Map(
    accesoSnapshot.docs.map((docSnap) => [docSnap.id, (docSnap.data()?.email || "").toString().trim()])
  );
  const dedupe = new Set();

  return registroSnapshot.docs
    .map((docSnap) => {
      const data = docSnap.data() || {};
      const email = (data.email || emailsLoginPorId.get(docSnap.id) || emailsAccesoPorId.get(docSnap.id) || "")
        .toString()
        .trim()
        .toLowerCase();

      return {
        id: docSnap.id,
        ...data,
        email
      };
    })
    .filter((jugadora) => Boolean(jugadora.email) && pertenecePorEquipo(jugadora, equipo))
    .filter((jugadora) => {
      if (dedupe.has(jugadora.email)) return false;
      dedupe.add(jugadora.email);
      return true;
    });
};

const MAX_DESTINATARIAS_POR_ENVIO = 100;

const chunkArray = (items = [], chunkSize = MAX_DESTINATARIAS_POR_ENVIO) => {
  const chunks = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
};

const enviarCorreoResendBatch = async ({ destinatarias = [], subject, text, html }) => {
  const { resendApiKey, fromEmail, fromName } = leerConfigCorreo();

  if (!resendApiKey || !fromEmail) {
    return {
      ok: false,
      skipped: true,
      error: "Falta configurar RESEND_API_KEY o NOTIFICATIONS_FROM_EMAIL"
    };
  }

  const payload = destinatarias.map((destinataria) => ({
    from: `${fromName} <${fromEmail}>`,
    to: [destinataria],
    subject,
    text,
    html
  }));

  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      ok: false,
      skipped: false,
      error: errorText || `HTTP ${response.status}`
    };
  }

  return { ok: true, skipped: false };
};

const esAdminOCoach = async (uid) => {
  if (!uid) return false;

  const userSnap = await admin.firestore().collection("users").doc(uid).get();
  if (!userSnap.exists) return false;

  const role = (userSnap.data()?.rol || "").toString().trim().toLowerCase();
  return role === "admin" || role === "coach";
};

const resolverUidAutenticado = async (data, context) => {
  if (context.auth?.uid) {
    return context.auth.uid;
  }

  const idToken = (data?.idToken || "").toString().trim();
  if (!idToken) {
    return "";
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded?.uid || "";
  } catch (error) {
    functions.logger.warn("resolverUidAutenticado invalid token", {
      error: serializarErrorCorreo(error)
    });
    return "";
  }
};

const extraerBearerToken = (req) => {
  const header = (req?.headers?.authorization || req?.headers?.Authorization || "").toString().trim();
  if (!header.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return header.slice(7).trim();
};

const responderJson = (res, status, payload) => {
  res.status(status).json(payload);
};

const aplicarCors = (req, res) => {
  const origin = req.headers.origin || "*";
  res.set("Access-Control-Allow-Origin", origin);
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const persistirEstadoCorreo = async (entrenamientoRef, estadoBase = {}) => {
  const estadoPersistido = {
    ...estadoBase,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (estadoBase.sentCount > 0) {
    estadoPersistido.sentAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await entrenamientoRef.set({
    emailNotification: estadoPersistido
  }, { merge: true });

  return {
    ...estadoBase,
    updatedAt: new Date().toISOString(),
    ...(estadoBase.sentCount > 0 ? { sentAt: new Date().toISOString() } : {})
  };
};

const procesarCorreoEntrenamiento = async ({
  entrenamientoId,
  entrenamiento = {},
  forzarEnvio = false,
  modo = "nuevo",
  origen = "automatico",
  solicitadoPorUid = null
}) => {
  const db = admin.firestore();
  const entrenamientoRef = db.collection("entrenamientos").doc(entrenamientoId);

  if (!forzarEnvio && entrenamiento.enviarCorreoJugadoras === false) {
    return persistirEstadoCorreo(entrenamientoRef, {
      status: "disabled",
      enabled: false,
      recipientsCount: 0,
      sentCount: 0,
      errors: [],
      mode: modo,
      source: origen
    });
  }

  const { resendApiKey, fromEmail } = leerConfigCorreo();
  if (!resendApiKey || !fromEmail) {
    functions.logger.warn("processTrainingEmail skipped: missing email config", { entrenamientoId, modo, origen });
    return persistirEstadoCorreo(entrenamientoRef, {
      status: "skipped_missing_config",
      enabled: true,
      recipientsCount: 0,
      sentCount: 0,
      errors: [],
      error: "Falta configurar RESEND_API_KEY o NOTIFICATIONS_FROM_EMAIL",
      mode: modo,
      source: origen,
      ...(solicitadoPorUid ? { requestedByUid: solicitadoPorUid } : {})
    });
  }

  const destinatarias = await obtenerDestinatariasEntrenamiento(entrenamiento.equipo);
  if (destinatarias.length === 0) {
    return persistirEstadoCorreo(entrenamientoRef, {
      status: "no_recipients",
      enabled: true,
      recipientsCount: 0,
      sentCount: 0,
      errors: [],
      mode: modo,
      source: origen,
      ...(solicitadoPorUid ? { requestedByUid: solicitadoPorUid } : {})
    });
  }

  const contenido = construirContenidoCorreo(entrenamiento, modo);
  const lotesDestinatarias = chunkArray(destinatarias.map((jugadora) => jugadora.email));
  const resultados = [];

  for (const lote of lotesDestinatarias) {
    const resultado = await enviarCorreoResendBatch({
      destinatarias: lote,
      ...contenido
    });

    resultados.push({ lote, resultado });
  }

  let enviados = 0;
  const errores = [];

  resultados.forEach(({ lote, resultado }) => {
    if (resultado?.ok) {
      enviados += lote.length;
      return;
    }

    const error = serializarErrorCorreo(resultado?.error);

    lote.forEach((destinataria) => {
      errores.push({ destinataria, error: error.toString().slice(0, 500) });
    });
  });

  const estado = await persistirEstadoCorreo(entrenamientoRef, {
    status: errores.length === 0 ? "sent" : (enviados > 0 ? "partial" : "failed"),
    enabled: true,
    recipientsCount: destinatarias.length,
    sentCount: enviados,
    errors: errores.slice(0, 10),
    mode: modo,
    source: origen,
    ...(solicitadoPorUid ? { requestedByUid: solicitadoPorUid } : {})
  });

  functions.logger.info("processTrainingEmail result", {
    entrenamientoId,
    recipients: destinatarias.length,
    sent: enviados,
    failed: errores.length,
    mode: modo,
    source: origen
  });

  return estado;
};

exports.notifyTrainingByEmail = functionsV1.runWith({
  secrets: ["RESEND_API_KEY"]
}).firestore.document("entrenamientos/{entrenamientoId}").onCreate(async (snapshot, context) => {
  const entrenamiento = snapshot.data() || {};
  try {
    await procesarCorreoEntrenamiento({
      entrenamientoId: context.params.entrenamientoId,
      entrenamiento,
      modo: "nuevo",
      origen: "automatico"
    });
  } catch (error) {
    functions.logger.error("notifyTrainingByEmail error", {
      entrenamientoId: context.params.entrenamientoId,
      error
    });
  }

  return null;
});

exports.notifyTrainingReminderByEmail = functionsV1.runWith({
  secrets: ["RESEND_API_KEY"]
}).firestore.document("entrenamientos/{entrenamientoId}").onUpdate(async (change, context) => {
  const before = change.before.data() || {};
  const after = change.after.data() || {};

  const beforeRequestId = (before.emailReminderRequest?.requestId || "").toString().trim();
  const afterRequestId = (after.emailReminderRequest?.requestId || "").toString().trim();

  if (!afterRequestId || afterRequestId === beforeRequestId) {
    return null;
  }

  try {
    await procesarCorreoEntrenamiento({
      entrenamientoId: context.params.entrenamientoId,
      entrenamiento: after,
      forzarEnvio: true,
      modo: "recordatorio",
      origen: "manual_trigger",
      solicitadoPorUid: (after.emailReminderRequest?.requestedByUid || "").toString().trim() || null
    });
  } catch (error) {
    functions.logger.error("notifyTrainingReminderByEmail error", {
      entrenamientoId: context.params.entrenamientoId,
      error
    });
  }

  return null;
});

exports.resendTrainingEmailReminder = functionsV1.runWith({
  secrets: ["RESEND_API_KEY"]
}).https.onRequest(async (req, res) => {
  aplicarCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    responderJson(res, 405, { error: "Metodo no permitido." });
    return;
  }

  const bearerToken = extraerBearerToken(req);
  const body = req.body || {};
  const entrenamientoId = (body?.entrenamientoId || body?.data?.entrenamientoId || "").toString().trim();

  let uid = "";

  if (bearerToken) {
    try {
      const decoded = await admin.auth().verifyIdToken(bearerToken);
      uid = decoded?.uid || "";
    } catch (error) {
      functions.logger.warn("resendTrainingEmailReminder invalid bearer token", {
        error: serializarErrorCorreo(error)
      });
    }
  }

  if (!uid) {
    responderJson(res, 401, { error: "Debes iniciar sesión para reenviar el correo." });
    return;
  }

  const autorizado = await esAdminOCoach(uid);
  if (!autorizado) {
    responderJson(res, 403, { error: "No tienes permisos para reenviar este correo." });
    return;
  }

  if (!entrenamientoId) {
    responderJson(res, 400, { error: "Debes indicar el entrenamiento a reenviar." });
    return;
  }

  const entrenamientoRef = admin.firestore().collection("entrenamientos").doc(entrenamientoId);
  const entrenamientoSnap = await entrenamientoRef.get();

  if (!entrenamientoSnap.exists) {
    responderJson(res, 404, { error: "No se encontró el entrenamiento solicitado." });
    return;
  }

  try {
    const emailNotification = await procesarCorreoEntrenamiento({
      entrenamientoId,
      entrenamiento: entrenamientoSnap.data() || {},
      forzarEnvio: true,
      modo: "recordatorio",
      origen: "manual",
      solicitadoPorUid: uid
    });

    responderJson(res, 200, {
      success: emailNotification.status === "sent" || emailNotification.status === "partial",
      emailNotification
    });
  } catch (error) {
    functions.logger.error("resendTrainingEmailReminder error", {
      entrenamientoId,
      requestedBy: uid,
      error
    });

    responderJson(res, 500, {
      error: "No se pudo reenviar el correo recordatorio.",
      detail: serializarErrorCorreo(error)
    });
  }
});

/**
 * Cloud Function para SUSCRIBIR un token de dispositivo a un tema (topic).
 */
exports.subscribeToTopic = functions.https.onCall(async (data, context) => {
  // Debug: log incoming data for troubleshooting
  try {
    functions.logger.info('subscribeToTopic incoming data', data);
  } catch (e) {
    functions.logger.warn('subscribeToTopic failed to log data', e);
  }

  // Be defensive: some clients may nest payload under data
  const token = (typeof data?.token === 'string' && data.token) || (typeof data?.data?.token === 'string' && data.data.token);
  const topic = (typeof data?.topic === 'string' && data.topic) || (typeof data?.data?.topic === 'string' && data.data.topic);

  if (!token || !topic) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "La función debe ser llamada con 'token' y 'topic'."
    );
  }

  try {
    // Usa el SDK de Admin para suscribir el token al tema.
    await admin.messaging().subscribeToTopic(token, topic);
    functions.logger.info('subscribeToTopic success', { token, topic });
    return { success: true, message: `Suscrito a ${topic}` };
  } catch (error) {
    functions.logger.error('subscribeToTopic error', { topic, error });
    throw new functions.https.HttpsError(
      "internal",
      "No se pudo completar la suscripción.",
      error
    );
  }
});


/**
 * Cloud Function para ENVIAR notificaciones push a un tema (topic).
 */
exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  // Log incoming data for troubleshooting
  try {
    functions.logger.info('sendPushNotification incoming data', data);
  } catch (e) {
    functions.logger.warn('sendPushNotification failed to log data', e);
  }

  // Be defensive: accept both flat and nested payloads
  const topic = (typeof data?.topic === 'string' && data.topic) || (typeof data?.data?.topic === 'string' && data.data.topic);
  const title = (typeof data?.title === 'string' && data.title) || (typeof data?.data?.title === 'string' && data.data.title);
  const body = (typeof data?.body === 'string' && data.body) || (typeof data?.data?.body === 'string' && data.data.body);

  if (!topic || !title || !body) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "La función debe ser llamada con 'topic', 'title' y 'body'."
    );
  }

  // Build FCM v1 webpush message
  const message = {
    topic,
    webpush: {
      notification: {
        title: title,
        body: body,
      },
      fcmOptions: {
        link: `https://www.clubdeportivovikingas.cl/entrenamientos`,
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    functions.logger.info('sendPushNotification success', { topic, title, body, response });
    return { success: true, messageId: response };
  } catch (error) {
    functions.logger.error('sendPushNotification error', { topic, error });
    throw new functions.https.HttpsError(
      "unknown",
      "No se pudo enviar la notificación.",
      error
    );
  }
});