import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './config';

const RESPUESTAS_COLLECTION = 'respuestasPostEntrenamiento';
const CONFIGURACION_DOC = 'seguimientoPostEntrenamiento';
export const TIPOS_SEGUIMIENTO = [
  { value: 'entrenamiento', label: 'Entrenamiento' },
  { value: 'partido', label: 'Partido' },
  { value: 'amistoso', label: 'Amistoso' },
  { value: 'liga', label: 'Liga' },
  { value: 'evento', label: 'Evento' }
];
export const EQUIPOS_SEGUIMIENTO = [
  { value: 'ascenso', label: 'Ascenso' },
  { value: 'escuela', label: 'Escuela' },
  { value: 'serieC', label: 'Serie C' }
];

export const PREGUNTAS_SEGUIMIENTO_DEFAULT = [
  { id: 'rpe', label: '¿Qué tan exigente fue el entrenamiento?', tipo: 'scale', minimo: 0, maximo: 10, activo: true },
  { id: 'fatiga', label: '¿Cómo está tu nivel de fatiga?', tipo: 'scale', minimo: 0, maximo: 10, activo: true },
  { id: 'recuperacion', label: '¿Cómo sientes tu recuperación?', tipo: 'scale', minimo: 0, maximo: 10, activo: true },
  { id: 'sueno', label: '¿Cómo estuvo la calidad de tu sueño?', tipo: 'scale', minimo: 0, maximo: 10, activo: true },
  { id: 'piernasPesadas', label: '¿Qué tan pesadas sientes las piernas?', tipo: 'scale', minimo: 0, maximo: 10, activo: true },
  { id: 'molestias', label: '¿Tuviste dolor o alguna molestia?', tipo: 'yesNo', activo: true }
];

export const obtenerConfiguracionSeguimiento = async () => {
  const snapshot = await getDoc(doc(db, 'configuracion', CONFIGURACION_DOC));
  const data = snapshot.data() || {};
  const preguntas = data.preguntas;

  return {
    preguntas: !snapshot.exists() || !Array.isArray(preguntas)
      ? PREGUNTAS_SEGUIMIENTO_DEFAULT.map((pregunta) => ({ ...pregunta }))
      : preguntas
      .filter((pregunta) => pregunta?.id && pregunta?.label && ['scale', 'yesNo', 'text'].includes(pregunta.tipo))
      .map((pregunta) => ({ ...pregunta, activo: pregunta.activo !== false })),
    tiposHabilitados: Array.isArray(data.tiposHabilitados)
      ? data.tiposHabilitados.filter((tipo) => TIPOS_SEGUIMIENTO.some((opcion) => opcion.value === tipo))
      : ['entrenamiento'],
    equiposHabilitados: Array.isArray(data.equiposHabilitados)
      ? data.equiposHabilitados.filter((equipo) => EQUIPOS_SEGUIMIENTO.some((opcion) => opcion.value === equipo))
      : EQUIPOS_SEGUIMIENTO.map((equipo) => equipo.value)
  };
};

export const guardarDisponibilidadSeguimiento = async ({ tiposHabilitados, equiposHabilitados }) => {
  const tiposValidos = TIPOS_SEGUIMIENTO
    .map((tipo) => tipo.value)
    .filter((tipo) => Array.isArray(tiposHabilitados) && tiposHabilitados.includes(tipo));
  const equiposValidos = EQUIPOS_SEGUIMIENTO
    .map((equipo) => equipo.value)
    .filter((equipo) => Array.isArray(equiposHabilitados) && equiposHabilitados.includes(equipo));

  await setDoc(doc(db, 'configuracion', CONFIGURACION_DOC), {
    tiposHabilitados: tiposValidos,
    equiposHabilitados: equiposValidos,
    updatedAt: serverTimestamp()
  }, { merge: true });
  return { tiposHabilitados: tiposValidos, equiposHabilitados: equiposValidos };
};

export const guardarConfiguracionSeguimiento = async (preguntas) => {
  const preguntasValidas = (Array.isArray(preguntas) ? preguntas : [])
    .filter((pregunta) => pregunta?.id && pregunta?.label && ['scale', 'yesNo', 'text'].includes(pregunta.tipo))
    .map((pregunta) => ({
      id: pregunta.id.toString(),
      label: pregunta.label.toString().trim().slice(0, 140),
      tipo: pregunta.tipo,
      minimo: normalizarEscala(pregunta.minimo ?? 0),
      maximo: normalizarEscala(pregunta.maximo ?? 10),
      activo: pregunta.activo !== false
    }))
    .filter((pregunta) => pregunta.label && pregunta.maximo > pregunta.minimo);

  if (!preguntasValidas.some((pregunta) => pregunta.activo)) {
    throw new Error('Debe quedar al menos una pregunta activa.');
  }

  await setDoc(doc(db, 'configuracion', CONFIGURACION_DOC), {
    preguntas: preguntasValidas,
    updatedAt: serverTimestamp()
  }, { merge: true });
  return preguntasValidas;
};

const normalizarEscala = (valor, maximo = 10) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 0;
  return Math.max(0, Math.min(maximo, Math.round(numero)));
};

export const obtenerRespuestasPostEntrenamientoJugadora = async (jugadoraId) => {
  if (!jugadoraId) return [];

  const consulta = query(
    collection(db, RESPUESTAS_COLLECTION),
    where('jugadoraId', '==', jugadoraId)
  );
  const snapshot = await getDocs(consulta);
  return snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
};

export const guardarRespuestaPostEntrenamiento = async ({
  entrenamiento,
  jugadoraId,
  jugadoraNombre,
  respuestas,
  preguntas
}) => {
  if (!entrenamiento?.id || !jugadoraId) throw new Error('Falta identificar la jugadora o el entrenamiento.');

  const rpe = normalizarEscala(respuestas?.rpe);
  const molestias = respuestas?.molestias === true;
  const intensidadMolestia = molestias ? normalizarEscala(respuestas?.intensidadMolestia) : 0;
  const zonaMolestia = molestias ? (respuestas?.zonaMolestia || '').toString().trim() : '';

  if (molestias && !zonaMolestia) throw new Error('Indica la zona de la molestia.');

  const respuestaId = `${entrenamiento.id}_${jugadoraId}`;
  const referencia = doc(db, RESPUESTAS_COLLECTION, respuestaId);
  const existente = await getDoc(referencia);
  if (existente.exists()) throw new Error('Ya respondiste el seguimiento de este entrenamiento.');

  const payload = {
    entrenamientoId: entrenamiento.id,
    entrenamientoNombre: (entrenamiento.nombre || 'Entrenamiento').toString().trim(),
    equipo: (entrenamiento.equipo || '').toString().trim().toLowerCase(),
    tipo: (entrenamiento.tipo || 'entrenamiento').toString().trim().toLowerCase(),
    jugadoraId,
    jugadoraNombre: (jugadoraNombre || '').toString().trim() || 'Sin nombre',
    rpe,
    fatiga: normalizarEscala(respuestas?.fatiga),
    recuperacion: normalizarEscala(respuestas?.recuperacion),
    sueno: normalizarEscala(respuestas?.sueno),
    piernasPesadas: normalizarEscala(respuestas?.piernasPesadas),
    molestias,
    zonaMolestia,
    intensidadMolestia,
    momentoMolestia: molestias ? (respuestas?.momentoMolestia || '').toString().trim() : '',
    continuaMolestia: molestias && respuestas?.continuaMolestia === true,
    limitaMovimiento: molestias && respuestas?.limitaMovimiento === true,
    comentario: (respuestas?.comentario || '').toString().trim().slice(0, 500),
    preguntasRespondidas: (Array.isArray(preguntas) ? preguntas : [])
      .filter((pregunta) => pregunta?.activo !== false && pregunta?.id && pregunta?.label)
      .map((pregunta) => ({
        id: pregunta.id,
        label: pregunta.label.toString().trim(),
        tipo: pregunta.tipo,
        valor: respuestas?.[pregunta.id] ?? null
      })),
    respuestas,
    revisada: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(referencia, payload);
  return { id: respuestaId, ...payload };
};

export const escucharRespuestasPostEntrenamiento = (callback, onError) => {
  return onSnapshot(
    collection(db, RESPUESTAS_COLLECTION),
    (snapshot) => callback(snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }))),
    onError
  );
};

export const marcarRespuestaPostEntrenamientoRevisada = async (id, revisada = true) => {
  if (!id) return;
  await updateDoc(doc(db, RESPUESTAS_COLLECTION, id), {
    revisada: revisada === true,
    updatedAt: serverTimestamp()
  });
};

export const eliminarRespuestaPostEntrenamiento = async (id) => {
  if (!id) return;
  await deleteDoc(doc(db, RESPUESTAS_COLLECTION, id));
};