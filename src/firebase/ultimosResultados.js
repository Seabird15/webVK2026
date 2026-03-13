import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

const COLECCION_RESULTADOS = 'ultimosResultadosHome';

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
    rival: normalizarTexto(data.rival),
    orden: Number.isFinite(Number(data.orden)) ? Number(data.orden) : null,
    marcadorVikingas,
    marcadorRival,
    resultadoFinal: marcadorVikingas !== '' || marcadorRival !== ''
      ? `${marcadorVikingas} - ${marcadorRival}`
      : normalizarTexto(data.resultadoFinal),
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
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

    const fechaA = a.createdAt?.seconds || 0;
    const fechaB = b.createdAt?.seconds || 0;
    return fechaB - fechaA;
  });
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
  return onSnapshot(obtenerColeccion(), (snapshot) => {
    callback(ordenarResultados(snapshot.docs.map(normalizarResultado)));
  });
};

export const obtenerUltimosResultados = async () => {
  const snapshot = await getDocs(obtenerColeccion());
  return ordenarResultados(snapshot.docs.map(normalizarResultado));
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