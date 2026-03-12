import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';

const SALUD_COLLECTION = 'saludSemanalRespuestas';

const normalizarNumero = (valor, min, max, fallback) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return fallback;
  return Math.max(min, Math.min(max, Math.round(numero)));
};

export const obtenerSemanaClave = (fecha = new Date()) => {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dia = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dia);
  const inicioAnio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const semana = Math.ceil((((d - inicioAnio) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(semana).padStart(2, '0')}`;
};

export const calcularRiesgoSalud = ({ dolor, fatiga, sueno }) => {
  if (dolor >= 4 || fatiga >= 4 || sueno <= 2) return 'alto';
  if (dolor >= 3 || fatiga >= 3 || sueno <= 3) return 'medio';
  return 'bajo';
};

export const obtenerRespuestaSemanalJugadora = async (jugadoraId, semanaClave = obtenerSemanaClave()) => {
  if (!jugadoraId) return null;
  const docId = `${jugadoraId}_${semanaClave}`;
  const refDoc = doc(db, SALUD_COLLECTION, docId);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const guardarRespuestaSaludSemanal = async ({
  jugadoraId,
  jugadoraNombre,
  equipo,
  dolor,
  fatiga,
  sueno,
  comentarios = ''
}) => {
  if (!jugadoraId) throw new Error('jugadoraId requerido');

  const semanaClave = obtenerSemanaClave();
  const docId = `${jugadoraId}_${semanaClave}`;
  const refDoc = doc(db, SALUD_COLLECTION, docId);
  const existente = await getDoc(refDoc);

  const payload = {
    jugadoraId,
    jugadoraNombre: (jugadoraNombre || '').toString().trim() || 'Sin nombre',
    equipo: (equipo || '').toString().trim().toLowerCase(),
    semanaClave,
    dolor: normalizarNumero(dolor, 1, 5, 1),
    fatiga: normalizarNumero(fatiga, 1, 5, 1),
    sueno: normalizarNumero(sueno, 1, 5, 5),
    comentarios: (comentarios || '').toString().trim(),
    riesgo: calcularRiesgoSalud({
      dolor: normalizarNumero(dolor, 1, 5, 1),
      fatiga: normalizarNumero(fatiga, 1, 5, 1),
      sueno: normalizarNumero(sueno, 1, 5, 5)
    }),
    revisada: existente.exists() ? (existente.data().revisada === true) : false,
    notificadaAdmin: existente.exists() ? (existente.data().notificadaAdmin === true) : false,
    updatedAt: serverTimestamp()
  };

  if (!existente.exists()) {
    payload.createdAt = serverTimestamp();
    payload.notificadaAdmin = false;
  }

  await setDoc(refDoc, payload, { merge: true });
  return { id: docId, ...payload };
};

export const escucharRespuestasSaludSemanal = (callback) => {
  const refCol = collection(db, SALUD_COLLECTION);
  const q = query(refCol, orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }));
    callback(items);
  });
};

export const escucharAlertasSaludSemanalAdmin = (callback) => {
  return escucharRespuestasSaludSemanal((items) => {
    const nuevas = items.filter((item) => item.notificadaAdmin !== true).length;
    const pendientesRevision = items.filter((item) => item.revisada !== true).length;
    callback({
      nuevas,
      pendientesRevision,
      ultimas: items.slice(0, 5)
    });
  });
};

export const marcarNotificacionSaludVista = async (id) => {
  if (!id) return;
  await updateDoc(doc(db, SALUD_COLLECTION, id), {
    notificadaAdmin: true,
    updatedAt: serverTimestamp()
  });
};

export const marcarRespuestaSaludRevisada = async (id, revisada = true) => {
  if (!id) return;
  await updateDoc(doc(db, SALUD_COLLECTION, id), {
    revisada: revisada === true,
    notificadaAdmin: true,
    updatedAt: serverTimestamp()
  });
};

export const marcarTodasNotificacionesSaludVistas = async () => {
  const snapshot = await getDocs(collection(db, SALUD_COLLECTION));
  const pendientes = snapshot.docs.filter((documento) => documento.data()?.notificadaAdmin !== true);
  await Promise.all(
    pendientes.map((documento) =>
      updateDoc(doc(db, SALUD_COLLECTION, documento.id), {
        notificadaAdmin: true,
        updatedAt: serverTimestamp()
      })
    )
  );
  return pendientes.length;
};

// Eliminar respuestas de salud más antiguas que X semanas
export const limpiarSaludSemanalAntiguaS = async (semanasMaximas = 1) => {
  try {
    const snapshot = await getDocs(collection(db, SALUD_COLLECTION));
    const ahora = Date.now();
    const semanasMs = semanasMaximas * 7 * 24 * 60 * 60 * 1000;
    
    let eliminados = 0;
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const fechaActualizacion = data.updatedAt?.seconds ? data.updatedAt.seconds * 1000 : data.createdAt?.seconds ? data.createdAt.seconds * 1000 : 0;
      const diferencia = ahora - fechaActualizacion;
      
      if (diferencia > semanasMs) {
        await deleteDoc(doc.ref);
        eliminados++;
      }
    }
    
    console.log(`🗑️ Limpiados ${eliminados} registros de salud antiguos (>${semanasMaximas} semana${semanasMaximas > 1 ? 's' : ''})`);
    return eliminados;
  } catch (err) {
    console.error('Error limpiando registros de salud antiguos:', err);
    return 0;
  }
};
