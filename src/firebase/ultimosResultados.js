import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

const COLECCION_RESULTADOS = 'ultimosResultadosHome';
const TIPOS_VISIBLES = new Set(['partido', 'liga', 'competicion', 'competición', 'amistoso']);

const normalizarTexto = (valor = '') => valor.toString().trim();
const normalizarMarcador = (valor = '') => {
  const texto = valor?.toString().trim();
  if (texto === '') return '';

  const numero = Number(texto);
  return Number.isNaN(numero) ? texto : String(Math.max(0, numero));
};

const extraerMarcadoresDesdeResultado = (resultadoFinal = '') => {
  const texto = normalizarTexto(resultadoFinal);
  const coincidencia = texto.match(/(\d+)\s*[-:]\s*(\d+)/);

  if (!coincidencia) {
    return {
      marcadorVikingas: '',
      marcadorRival: ''
    };
  }

  return {
    marcadorVikingas: coincidencia[1],
    marcadorRival: coincidencia[2]
  };
};

const obtenerFecha = (valor) => {
  if (!valor) return null;
  if (valor instanceof Date) return new Date(valor);
  if (typeof valor?.toDate === 'function') return valor.toDate();
  if (typeof valor?.seconds === 'number') return new Date(valor.seconds * 1000);

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const formatearFecha = (valor) => {
  const fecha = obtenerFecha(valor);
  if (!fecha) return '';

  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const normalizarEquipoCategoria = (equipo = '') => {
  const valor = normalizarTexto(equipo).toLowerCase();

  if (valor === 'ascenso') return 'Ascenso';
  if (valor === 'seriec' || valor === 'serie c' || valor === 'seriec ') return 'Serie C';
  if (valor === 'escuela') return 'Escuela';
  if (valor === 'ambos') return 'Ascenso y Serie C';

  return normalizarTexto(equipo);
};

const normalizarTipoResultado = (tipo = '') => {
  const valor = normalizarTexto(tipo).toLowerCase();

  if (valor === 'amistoso') return 'amistoso';
  if (['partido', 'liga', 'competicion', 'competición'].includes(valor)) return 'liga';

  return valor;
};

const obtenerEtiquetaTipo = (tipo = '') => {
  return normalizarTipoResultado(tipo) === 'amistoso' ? 'Amistoso' : 'Liga';
};

const esResultadoVisible = (data = {}) => {
  const tipo = normalizarTexto(data.tipo).toLowerCase();
  if (!TIPOS_VISIBLES.has(tipo)) return false;

  return data.estado === 'FINALIZADO' || data.fasePartido === 'FINALIZADO';
};

const crearResultadoAutomatico = ({ id, data, fuente }) => {
  const tipoNormalizado = normalizarTipoResultado(data.tipo);
  const fecha = obtenerFecha(data.fecha);
  const updatedAt = obtenerFecha(data.updatedAt) || obtenerFecha(data.createdAt) || fecha;
  const marcadorVikingas = normalizarMarcador(data.golesLocal ?? data.resultadoLocal ?? 0);
  const marcadorRival = normalizarMarcador(data.golesVisita ?? data.resultadoVisita ?? 0);

  return {
    id: `${fuente}-${id}`,
    fuente,
    nombreLiga: obtenerEtiquetaTipo(tipoNormalizado),
    categoria: normalizarEquipoCategoria(data.equipo) || 'CD Vikingas',
    fecha: formatearFecha(data.fecha),
    fechaDate: fecha,
    rival: normalizarTexto(data.rival || data.nombre || 'Rival por confirmar'),
    orden: null,
    marcadorVikingas,
    marcadorRival,
    goleadoras: Array.isArray(data.goleadoresLocal) ? data.goleadoresLocal : [],
    resultadoFinal: `${marcadorVikingas} - ${marcadorRival}`,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    updatedAtDate: updatedAt,
    tipo: tipoNormalizado
  };
};

const normalizarResultado = (docSnap) => {
  const data = docSnap.data();
  const marcadoresLegacy = extraerMarcadoresDesdeResultado(data.resultadoFinal);
  const marcadorVikingas = normalizarMarcador(data.marcadorVikingas ?? marcadoresLegacy.marcadorVikingas);
  const marcadorRival = normalizarMarcador(data.marcadorRival ?? marcadoresLegacy.marcadorRival);

  return {
    id: docSnap.id,
    nombreLiga: normalizarTexto(data.nombreLiga),
    categoria: normalizarTexto(data.categoria),
    fecha: normalizarTexto(data.fecha),
    fechaDate: obtenerFecha(data.fecha),
    rival: normalizarTexto(data.rival),
    orden: Number.isFinite(Number(data.orden)) ? Number(data.orden) : null,
    marcadorVikingas,
    marcadorRival,
    resultadoFinal: marcadorVikingas !== '' || marcadorRival !== ''
      ? `${marcadorVikingas} - ${marcadorRival}`
      : normalizarTexto(data.resultadoFinal),
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    updatedAtDate: obtenerFecha(data.updatedAt) || obtenerFecha(data.createdAt) || obtenerFecha(data.fecha)
  };
};

const obtenerColeccion = () => collection(db, COLECCION_RESULTADOS);

const ordenarResultados = (items = []) => {
  return [...items].sort((a, b) => {
    const ordenA = Number.isFinite(Number(a.orden)) ? Number(a.orden) : Number.MAX_SAFE_INTEGER;
    const ordenB = Number.isFinite(Number(b.orden)) ? Number(b.orden) : Number.MAX_SAFE_INTEGER;

    if (ordenA !== ordenB) {
      return ordenA - ordenB;
    }

    const fechaA = a.updatedAtDate?.getTime?.() || a.fechaDate?.getTime?.() || a.createdAt?.seconds * 1000 || 0;
    const fechaB = b.updatedAtDate?.getTime?.() || b.fechaDate?.getTime?.() || b.createdAt?.seconds * 1000 || 0;
    return fechaB - fechaA;
  });
};

const obtenerResultadosAutomaticos = async () => {
  const entrenamientosQuery = query(
    collection(db, 'entrenamientos'),
    where('tipo', 'in', ['partido', 'amistoso'])
  );

  const [snapshotEntrenamientos, snapshotPartidos] = await Promise.all([
    getDocs(entrenamientosQuery),
    getDocs(collection(db, 'partidos'))
  ]);

  const resultadosEntrenamientos = snapshotEntrenamientos.docs
    .map((docSnap) => ({ id: docSnap.id, data: docSnap.data() }))
    .filter(({ data }) => esResultadoVisible(data))
    .map(({ id, data }) => crearResultadoAutomatico({ id, data, fuente: 'entrenamiento' }));

  const resultadosPartidos = snapshotPartidos.docs
    .map((docSnap) => ({ id: docSnap.id, data: docSnap.data() }))
    .filter(({ data }) => esResultadoVisible(data))
    .map(({ id, data }) => crearResultadoAutomatico({ id, data, fuente: 'partido' }));

  return ordenarResultados([...resultadosEntrenamientos, ...resultadosPartidos]);
};

const obtenerSiguienteOrden = async () => {
  const snapshot = await getDocs(obtenerColeccion());
  const maxOrden = snapshot.docs.reduce((maximo, docSnap) => {
    const actual = Number(docSnap.data()?.orden);
    if (!Number.isFinite(actual)) return maximo;
    return Math.max(maximo, actual);
  }, -1);

  return maxOrden + 1;
};

export const escucharUltimosResultados = (callback) => {
  let resultadosEntrenamientos = [];
  let resultadosPartidos = [];

  const emitir = () => {
    callback(ordenarResultados([...resultadosEntrenamientos, ...resultadosPartidos]));
  };

  const entrenamientosQuery = query(
    collection(db, 'entrenamientos'),
    where('tipo', 'in', ['partido', 'amistoso'])
  );

  const unsubscribeEntrenamientos = onSnapshot(entrenamientosQuery, (snapshot) => {
    resultadosEntrenamientos = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, data: docSnap.data() }))
      .filter(({ data }) => esResultadoVisible(data))
      .map(({ id, data }) => crearResultadoAutomatico({ id, data, fuente: 'entrenamiento' }));

    emitir();
  });

  const unsubscribePartidos = onSnapshot(collection(db, 'partidos'), (snapshot) => {
    resultadosPartidos = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, data: docSnap.data() }))
      .filter(({ data }) => esResultadoVisible(data))
      .map(({ id, data }) => crearResultadoAutomatico({ id, data, fuente: 'partido' }));

    emitir();
  });

  return () => {
    unsubscribeEntrenamientos?.();
    unsubscribePartidos?.();
  };
};

export const obtenerUltimosResultados = async () => {
  return obtenerResultadosAutomaticos();
};

export const crearUltimoResultado = async (payload) => {
  const marcadorVikingas = normalizarMarcador(payload.marcadorVikingas);
  const marcadorRival = normalizarMarcador(payload.marcadorRival);
  const orden = Number.isFinite(Number(payload.orden)) ? Number(payload.orden) : await obtenerSiguienteOrden();

  return addDoc(obtenerColeccion(), {
    nombreLiga: normalizarTexto(payload.nombreLiga),
    categoria: normalizarTexto(payload.categoria),
    fecha: normalizarTexto(payload.fecha),
    rival: normalizarTexto(payload.rival),
    orden,
    marcadorVikingas,
    marcadorRival,
    resultadoFinal: `${marcadorVikingas} - ${marcadorRival}`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const actualizarUltimoResultado = async (id, payload) => {
  const resultadoRef = doc(db, COLECCION_RESULTADOS, id);
  const marcadorVikingas = normalizarMarcador(payload.marcadorVikingas);
  const marcadorRival = normalizarMarcador(payload.marcadorRival);
  const actualizacion = {
    updatedAt: serverTimestamp()
  };

  if (Object.prototype.hasOwnProperty.call(payload, 'nombreLiga')) {
    actualizacion.nombreLiga = normalizarTexto(payload.nombreLiga);
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'categoria')) {
    actualizacion.categoria = normalizarTexto(payload.categoria);
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'fecha')) {
    actualizacion.fecha = normalizarTexto(payload.fecha);
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'rival')) {
    actualizacion.rival = normalizarTexto(payload.rival);
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'marcadorVikingas')) {
    actualizacion.marcadorVikingas = marcadorVikingas;
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'marcadorRival')) {
    actualizacion.marcadorRival = marcadorRival;
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'orden')) {
    actualizacion.orden = Number(payload.orden);
  }

  if (actualizacion.marcadorVikingas !== undefined || actualizacion.marcadorRival !== undefined) {
    const marcadorVikingasFinal = actualizacion.marcadorVikingas ?? marcadorVikingas;
    const marcadorRivalFinal = actualizacion.marcadorRival ?? marcadorRival;
    actualizacion.resultadoFinal = `${marcadorVikingasFinal} - ${marcadorRivalFinal}`;
  }

  await updateDoc(resultadoRef, actualizacion);
};

export const eliminarUltimoResultado = async (id) => {
  await deleteDoc(doc(db, COLECCION_RESULTADOS, id));
};

export const actualizarOrdenUltimosResultados = async (items = []) => {
  const batch = writeBatch(db);

  items.forEach((item, index) => {
    if (!item?.id) return;

    batch.update(doc(db, COLECCION_RESULTADOS, item.id), {
      orden: index,
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
};