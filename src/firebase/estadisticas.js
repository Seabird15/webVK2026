import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { ref } from 'vue';
import { db } from './config';

export const estadisticas = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

export const COLECCIONES_ESTADISTICAS = {
  ascenso: 'estadisticasAscenso',
  serieC: 'estadisticasSerieC'
};

const TIPOS_COMPETICION = new Set(['partido', 'competicion', 'competición', 'liga']);
const TIPOS_AMISTOSO = new Set(['amistoso', 'amistosos']);

const crearBloqueBase = () => ({
  goles: 0,
  asistencias: 0,
  partidos: 0
});

const normalizarEquipo = (equipo = '') => {
  const valor = equipo.toString().trim().toLowerCase();
  if (valor === 'seriec' || valor === 'serie-c') return 'serieC';
  if (valor === 'ascenso' || valor === 'serieC') return valor;
  return '';
};

export const normalizarTipoEstadistica = (tipo = 'competicion') => {
  const valor = tipo.toString().trim().toLowerCase();
  if (TIPOS_AMISTOSO.has(valor)) return 'amistoso';
  if (TIPOS_COMPETICION.has(valor)) return 'competicion';
  return 'competicion';
};

export const obtenerColeccionEstadisticas = (equipo) => {
  const equipoNormalizado = normalizarEquipo(equipo);
  return COLECCIONES_ESTADISTICAS[equipoNormalizado] || null;
};

const normalizarNombre = (valor = '') => {
  return valor.toString().trim().toLowerCase().replace(/\s+/g, ' ');
};

const extraerEquiposJugadora = (jugadora = {}) => {
  if (Array.isArray(jugadora.equipos) && jugadora.equipos.length > 0) {
    return [...new Set(jugadora.equipos.map(normalizarEquipo).filter(Boolean))];
  }

  const equipoNormalizado = normalizarEquipo(jugadora.equipo);
  if (equipoNormalizado) {
    return [equipoNormalizado];
  }

  if ((jugadora.equipo || '').toString().trim().toLowerCase() === 'ambos') {
    return ['ascenso'];
  }

  return [];
};

const perteneceAlEquipo = (jugadora, equipo) => {
  return extraerEquiposJugadora(jugadora).includes(normalizarEquipo(equipo));
};

const construirEstadisticasNormalizadas = (estadisticasActuales = {}) => {
  return {
    competicion: {
      ...crearBloqueBase(),
      ...(estadisticasActuales.competicion || {})
    },
    amistoso: {
      ...crearBloqueBase(),
      ...(estadisticasActuales.amistoso || {})
    }
  };
};

const calcularTotales = (estadisticasActuales = {}) => {
  const estadisticasNormalizadas = construirEstadisticasNormalizadas(estadisticasActuales);

  return {
    goles: Number(estadisticasNormalizadas.competicion.goles || 0) + Number(estadisticasNormalizadas.amistoso.goles || 0),
    asistencias: Number(estadisticasNormalizadas.competicion.asistencias || 0) + Number(estadisticasNormalizadas.amistoso.asistencias || 0),
    partidos: Number(estadisticasNormalizadas.competicion.partidos || 0) + Number(estadisticasNormalizadas.amistoso.partidos || 0)
  };
};

const crearMapaLegacy = async (equipo) => {
  const legacy = new Map();

  const asignarLegacy = (nombreCompleto, tipo, data = {}) => {
    if (!nombreCompleto) return;

    const existente = legacy.get(nombreCompleto) || {
      competicion: crearBloqueBase(),
      amistoso: crearBloqueBase()
    };

    existente[tipo] = {
      ...existente[tipo],
      goles: Number(data.goles || 0),
      asistencias: Number(data.asistencias || 0),
      partidos: Number(data.partidos || 0)
    };

    legacy.set(nombreCompleto, existente);
  };

  const snapshotCompeticion = await getDocs(collection(db, 'estadisticas'));
  snapshotCompeticion.docs.forEach((docSnap) => {
    const data = docSnap.data();
    if (normalizarEquipo(data.equipo) !== normalizarEquipo(equipo)) {
      return;
    }

    asignarLegacy(normalizarNombre(`${data.nombre || ''} ${data.apellido || ''}`), 'competicion', data);
  });

  if (normalizarEquipo(equipo) === 'ascenso') {
    const snapshotAmistosos = await getDocs(collection(db, 'estadisticasAscAmistosos'));
    snapshotAmistosos.docs.forEach((docSnap) => {
      const data = docSnap.data();
      asignarLegacy(normalizarNombre(`${data.nombre || ''} ${data.apellido || ''}`), 'amistoso', data);
    });
  }

  return legacy;
};

const construirDocumentoEstadisticas = (jugadora, equipo, anterior = {}, legado = null) => {
  const estadisticasPrevias = anterior.estadisticas || legado || {};
  const estadisticasNormalizadas = construirEstadisticasNormalizadas(estadisticasPrevias);

  return {
    uid: jugadora.uid || jugadora.id,
    jugadoraId: jugadora.uid || jugadora.id,
    nombre: jugadora.nombre || anterior.nombre || '',
    apellido: jugadora.apellido || anterior.apellido || '',
    dorsal: jugadora.dorsal ?? anterior.dorsal ?? null,
    posicion: jugadora.posicion || anterior.posicion || '',
    fotoPerfil: jugadora.fotoPerfil || jugadora.foto || anterior.fotoPerfil || null,
    equipo,
    activa: jugadora.perfilCompleto !== false,
    estadisticas: estadisticasNormalizadas,
    totales: calcularTotales(estadisticasNormalizadas),
    createdAt: anterior.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp()
  };
};

const obtenerJugadorasRegistroPorEquipo = async (equipo) => {
  const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
    .filter((jugadora) => perteneceAlEquipo(jugadora, equipo));
};

export const sincronizarEstadisticasEquipo = async (equipo) => {
  const equipoNormalizado = normalizarEquipo(equipo);
  const nombreColeccion = obtenerColeccionEstadisticas(equipoNormalizado);

  if (!nombreColeccion) {
    return 0;
  }

  const jugadorasEquipo = await obtenerJugadorasRegistroPorEquipo(equipoNormalizado);
  const mapaLegacy = await crearMapaLegacy(equipoNormalizado);

  await Promise.all(
    jugadorasEquipo.map(async (jugadora) => {
      const docId = jugadora.uid || jugadora.id;
      if (!docId) return;

      const estadisticaRef = doc(db, nombreColeccion, docId);
      const estadisticaSnap = await getDoc(estadisticaRef);
      const anterior = estadisticaSnap.exists() ? estadisticaSnap.data() : {};
      const nombreCompleto = normalizarNombre(`${jugadora.nombre || ''} ${jugadora.apellido || ''}`);
      const legado = mapaLegacy.get(nombreCompleto) || null;

      await setDoc(estadisticaRef, construirDocumentoEstadisticas(jugadora, equipoNormalizado, anterior, legado), { merge: true });
    })
  );

  return jugadorasEquipo.length;
};

export const sincronizarTodasLasEstadisticas = async () => {
  await Promise.all(Object.keys(COLECCIONES_ESTADISTICAS).map((equipo) => sincronizarEstadisticasEquipo(equipo)));
};

export const obtenerEstadisticasEquipo = async (equipo, opciones = {}) => {
  const { sincronizar = true } = opciones;
  const equipoNormalizado = normalizarEquipo(equipo);
  const nombreColeccion = obtenerColeccionEstadisticas(equipoNormalizado);

  if (!nombreColeccion) {
    return [];
  }

  isLoading.value = true;
  error.value = null;

  try {
    if (sincronizar) {
      await sincronizarEstadisticasEquipo(equipoNormalizado);
    }

    const snapshot = await getDocs(collection(db, nombreColeccion));
    const datos = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      estadisticas: construirEstadisticasNormalizadas(docSnap.data().estadisticas),
      totales: calcularTotales(docSnap.data().estadisticas)
    }));

    estadisticas.value = datos;
    return datos;
  } catch (err) {
    error.value = err.message;
    return [];
  } finally {
    isLoading.value = false;
  }
};

export const escucharEstadisticasEquipo = (equipo, callback) => {
  const nombreColeccion = obtenerColeccionEstadisticas(equipo);
  if (!nombreColeccion) {
    return () => {};
  }

  return onSnapshot(collection(db, nombreColeccion), (snapshot) => {
    const datos = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      estadisticas: construirEstadisticasNormalizadas(docSnap.data().estadisticas),
      totales: calcularTotales(docSnap.data().estadisticas)
    }));

    estadisticas.value = datos;
    if (callback) {
      callback(datos);
    }
  }, (err) => {
    error.value = err.message;
  });
};

const buscarDocumentoPorNombre = async (equipo, jugadoraNombre = '') => {
  const nombreColeccion = obtenerColeccionEstadisticas(equipo);
  if (!nombreColeccion || !jugadoraNombre.trim()) {
    return null;
  }

  const nombreBuscado = normalizarNombre(jugadoraNombre);
  const snapshot = await getDocs(collection(db, nombreColeccion));
  let coincidenciaParcial = null;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const nombreCompleto = normalizarNombre(`${data.nombre || ''} ${data.apellido || ''}`);
    const soloNombre = normalizarNombre(data.nombre || '');

    if (nombreCompleto === nombreBuscado || soloNombre === nombreBuscado) {
      return { id: docSnap.id, ref: docSnap.ref, data };
    }

    if (!coincidenciaParcial && (nombreCompleto.includes(nombreBuscado) || nombreBuscado.includes(nombreCompleto))) {
      coincidenciaParcial = { id: docSnap.id, ref: docSnap.ref, data };
    }
  }

  return coincidenciaParcial;
};

const resolverDocumentoEstadistica = async ({ equipo, jugadoraId, jugadoraNombre = '' }) => {
  const nombreColeccion = obtenerColeccionEstadisticas(equipo);
  if (!nombreColeccion) {
    return null;
  }

  if (jugadoraId) {
    const estadisticaRef = doc(db, nombreColeccion, jugadoraId);
    let estadisticaSnap = await getDoc(estadisticaRef);
    if (!estadisticaSnap.exists()) {
      await sincronizarEstadisticasEquipo(equipo);
      estadisticaSnap = await getDoc(estadisticaRef);
    }
    if (estadisticaSnap.exists()) {
      return {
        id: estadisticaSnap.id,
        ref: estadisticaRef,
        data: estadisticaSnap.data()
      };
    }
  }

  return buscarDocumentoPorNombre(equipo, jugadoraNombre);
};

export const actualizarContadorEstadistica = async ({ equipo, jugadoraId, jugadoraNombre = '', tipo, campo, delta }) => {
  const tipoNormalizado = normalizarTipoEstadistica(tipo);
  const documento = await resolverDocumentoEstadistica({ equipo, jugadoraId, jugadoraNombre });

  if (!documento || !['goles', 'asistencias', 'partidos'].includes(campo)) {
    return false;
  }

  const estadisticasActuales = construirEstadisticasNormalizadas(documento.data.estadisticas);
  const totalesActuales = calcularTotales(estadisticasActuales);
  const siguienteValor = Math.max(0, Number(estadisticasActuales[tipoNormalizado][campo] || 0) + delta);
  const siguienteTotal = Math.max(0, Number(totalesActuales[campo] || 0) + delta);

  await updateDoc(documento.ref, {
    [`estadisticas.${tipoNormalizado}.${campo}`]: siguienteValor,
    [`totales.${campo}`]: siguienteTotal,
    updatedAt: serverTimestamp()
  });

  return true;
};

export const actualizarEstadisticaManualJugadora = async ({ equipo, jugadoraId, tipo, goles, asistencias }) => {
  const tipoNormalizado = normalizarTipoEstadistica(tipo);
  const documento = await resolverDocumentoEstadistica({ equipo, jugadoraId });

  if (!documento) {
    return false;
  }

  const estadisticasActuales = construirEstadisticasNormalizadas(documento.data.estadisticas);
  const nuevoBloque = {
    ...estadisticasActuales[tipoNormalizado],
    goles: Math.max(0, Number(goles || 0)),
    asistencias: Math.max(0, Number(asistencias || 0))
  };

  const nuevasEstadisticas = {
    ...estadisticasActuales,
    [tipoNormalizado]: nuevoBloque
  };

  await updateDoc(documento.ref, {
    [`estadisticas.${tipoNormalizado}`]: nuevoBloque,
    totales: calcularTotales(nuevasEstadisticas),
    updatedAt: serverTimestamp()
  });

  return true;
};

export const obtenerTotalesEstadisticasJugadora = async (jugadoraId) => {
  const totales = {
    goles: 0,
    asistencias: 0,
    partidos: 0
  };

  if (!jugadoraId) {
    return totales;
  }

  for (const nombreColeccion of Object.values(COLECCIONES_ESTADISTICAS)) {
    const estadisticaSnap = await getDoc(doc(db, nombreColeccion, jugadoraId));
    if (!estadisticaSnap.exists()) {
      continue;
    }

    const data = estadisticaSnap.data();
    const estadisticasActuales = construirEstadisticasNormalizadas(data.estadisticas);
    const totalesActuales = data.totales || calcularTotales(estadisticasActuales);

    totales.goles += Number(totalesActuales.goles || 0);
    totales.asistencias += Number(totalesActuales.asistencias || 0);
    totales.partidos += Number(totalesActuales.partidos || 0);
  }

  return totales;
};

export const obtenerResumenPorTipo = (jugadora, tipo) => {
  const tipoNormalizado = normalizarTipoEstadistica(tipo);
  const estadisticasActuales = construirEstadisticasNormalizadas(jugadora?.estadisticas);

  return {
    ...crearBloqueBase(),
    ...estadisticasActuales[tipoNormalizado]
  };
};

export const obtenerEstadisticasPorEquipo = async (equipo) => {
  return obtenerEstadisticasEquipo(equipo);
};

export const agregarEstadistica = async (data) => {
  const equipo = normalizarEquipo(data?.equipo);
  const nombreColeccion = obtenerColeccionEstadisticas(equipo);
  const jugadoraId = data?.jugadoraId || data?.uid || data?.id;

  if (!nombreColeccion || !jugadoraId) {
    throw new Error('Faltan datos para crear la estadística');
  }

  await setDoc(doc(db, nombreColeccion, jugadoraId), {
    ...construirDocumentoEstadisticas(data, equipo),
    updatedAt: serverTimestamp()
  }, { merge: true });

  return jugadoraId;
};

export const actualizarEstadistica = async (id, data) => {
  const equipo = normalizarEquipo(data?.equipo);
  const nombreColeccion = obtenerColeccionEstadisticas(equipo);

  if (!nombreColeccion) {
    throw new Error('Equipo inválido para actualizar estadísticas');
  }

  await updateDoc(doc(db, nombreColeccion, id), {
    ...data,
    updatedAt: serverTimestamp()
  });

  return true;
};

export const eliminarEstadistica = async (id, equipo) => {
  const nombreColeccion = obtenerColeccionEstadisticas(equipo);
  if (!nombreColeccion) {
    throw new Error('Equipo inválido para eliminar estadísticas');
  }

  await deleteDoc(doc(db, nombreColeccion, id));
  return true;
};
