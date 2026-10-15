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

export const TIPOS_PREGUNTA = [
  { value: 'text', label: 'Texto' },
  { value: 'yesNo', label: 'Sí o No' },
  { value: 'scale', label: 'Escala 0-10' }
];
export const sufijoMusculo = (id) => `${id}__musculo`;
export const MUSCULOS_DEFAULT = [
  'Cuello', 'Hombro', 'Pecho', 'Espalda alta', 'Zona lumbar', 'Abdomen',
  'Glúteo', 'Cadera', 'Aductores', 'Isquiotibiales', 'Cuádriceps',
  'Rodilla', 'Pantorrilla', 'Tobillo', 'Pie'
];
const TIPOS_VALIDOS = TIPOS_PREGUNTA.map((tipo) => tipo.value);
const TIPOS_OBLIGATORIOS_POR_DEFECTO = ['scale', 'yesNo'];
const TIPOS_ANTERIORES_MUSCULO = ['muscles', 'muscleSelect'];

// Las preguntas guardadas con tipos de versiones anteriores se convierten a los tipos vigentes.
const normalizarTipo = (tipo) => (TIPOS_VALIDOS.includes(tipo) ? tipo : 'text');

export const preguntaPideMusculo = (pregunta) => pregunta?.pedirMusculo === true;

export const musculoVisible = (pregunta, valor) => (
  preguntaPideMusculo(pregunta) && (pregunta.tipo !== 'yesNo' || valor === true)
);

export const esPreguntaObligatoria = (pregunta) => (
  typeof pregunta?.obligatoria === 'boolean'
    ? pregunta.obligatoria
    : TIPOS_OBLIGATORIOS_POR_DEFECTO.includes(pregunta?.tipo)
);

const normalizarOpciones = (opciones) => {
  const lista = Array.isArray(opciones) ? opciones : [];
  return [...new Set(lista.map((opcion) => (opcion ?? '').toString().trim().slice(0, 60)).filter(Boolean))].slice(0, 30);
};

export const normalizarPregunta = (pregunta) => {
  if (!pregunta?.id || !pregunta?.label) return null;

  const tipo = normalizarTipo(pregunta.tipo);
  const normalizada = {
    id: pregunta.id.toString(),
    label: pregunta.label.toString().trim().slice(0, 140),
    tipo,
    activo: pregunta.activo !== false,
    obligatoria: esPreguntaObligatoria({ ...pregunta, tipo }),
    pedirMusculo: pregunta.pedirMusculo === true || TIPOS_ANTERIORES_MUSCULO.includes(pregunta.tipo)
  };

  const ayuda = (pregunta.ayuda || '').toString().trim().slice(0, 200);
  if (ayuda) normalizada.ayuda = ayuda;

  if (normalizada.tipo === 'scale') {
    normalizada.minimo = normalizarEscala(pregunta.minimo ?? 0);
    normalizada.maximo = normalizarEscala(pregunta.maximo ?? 10);
    const etiquetaMin = (pregunta.etiquetaMin || '').toString().trim().slice(0, 40);
    const etiquetaMax = (pregunta.etiquetaMax || '').toString().trim().slice(0, 40);
    if (etiquetaMin) normalizada.etiquetaMin = etiquetaMin;
    if (etiquetaMax) normalizada.etiquetaMax = etiquetaMax;
  }

  if (normalizada.pedirMusculo) {
    const musculos = normalizarOpciones(pregunta.musculos ?? pregunta.opciones);
    normalizada.musculos = musculos.length ? musculos : [...MUSCULOS_DEFAULT];
  }

  return normalizada;
};

const normalizarValorPregunta = (pregunta, valor) => {
  if (pregunta.tipo === 'text') return (valor ?? '').toString().trim().slice(0, 300);
  return valor ?? null;
};

const normalizarMusculoPregunta = (pregunta, valor, valorPregunta) => {
  if (!musculoVisible(pregunta, valorPregunta)) return '';
  const permitidos = normalizarOpciones(pregunta.musculos);
  const lista = permitidos.length ? permitidos : MUSCULOS_DEFAULT;
  return lista.includes(valor) ? valor : '';
};

const respuestaVacia = (valor) => valor === null || valor === undefined || valor === '';

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
      : preguntas.map(normalizarPregunta).filter(Boolean),
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
    .map(normalizarPregunta)
    .filter((pregunta) => pregunta?.label && (pregunta.tipo !== 'scale' || pregunta.maximo > pregunta.minimo));

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
  const detalleMolestia = molestias ? (respuestas?.detalleMolestia || '').toString().trim().slice(0, 300) : '';

  if (molestias && !zonaMolestia) throw new Error('Indica la zona de la molestia.');
  if (molestias && !detalleMolestia) throw new Error('Describe la molestia con más detalle.');

  const preguntasActivas = (Array.isArray(preguntas) ? preguntas : [])
    .filter((pregunta) => pregunta?.activo !== false && pregunta?.id && pregunta?.label);
  const preguntasRespondidas = preguntasActivas.map((pregunta) => {
    const tipo = pregunta.tipo === 'periodo' ? 'periodo' : normalizarTipo(pregunta.tipo);
    const valor = normalizarValorPregunta({ ...pregunta, tipo }, respuestas?.[pregunta.id]);
    const musculo = normalizarMusculoPregunta(
      { ...pregunta, tipo },
      respuestas?.[sufijoMusculo(pregunta.id)],
      valor
    );
    return {
      id: pregunta.id,
      label: pregunta.label.toString().trim(),
      tipo,
      valor,
      ...(tipo === 'scale' && { maximo: normalizarEscala(pregunta.maximo ?? 10) }),
      ...(preguntaPideMusculo(pregunta) && { musculo })
    };
  });
  const faltante = preguntasActivas.find((pregunta, indice) => {
    if (pregunta.tipo === 'periodo' || !esPreguntaObligatoria(pregunta)) return false;
    const respondida = preguntasRespondidas[indice];
    return respuestaVacia(respondida.valor)
      || (musculoVisible(pregunta, respondida.valor) && !respondida.musculo);
  });
  if (faltante) throw new Error(`Responde la pregunta: ${faltante.label}`);

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
    detalleMolestia,
    momentoMolestia: molestias ? (respuestas?.momentoMolestia || '').toString().trim() : '',
    continuaMolestia: molestias && respuestas?.continuaMolestia === true,
    limitaMovimiento: molestias && respuestas?.limitaMovimiento === true,
    comentario: (respuestas?.comentario || '').toString().trim().slice(0, 500),
    preguntasRespondidas,
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