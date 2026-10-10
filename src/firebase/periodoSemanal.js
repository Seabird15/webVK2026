import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

const SALUD_COLLECTION = 'saludSemanalRespuestas';

export const obtenerSemanaClave = (fecha = new Date()) => {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dia = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dia);
  const inicioAnio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const semana = Math.ceil((((d - inicioAnio) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(semana).padStart(2, '0')}`;
};

export const obtenerEstadoPeriodoSemanal = async (jugadoraId, semanaClave = obtenerSemanaClave()) => {
  if (!jugadoraId) return null;
  const refDoc = doc(db, SALUD_COLLECTION, `${jugadoraId}_${semanaClave}`);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return null;
  const respuesta = snap.data();
  if (!Object.prototype.hasOwnProperty.call(respuesta, 'enPeriodo')) return null;
  return respuesta.enPeriodo;
};

export const guardarEstadoPeriodoSemanal = async ({ jugadoraId, jugadoraNombre, equipo, enPeriodo }) => {
  if (!jugadoraId) throw new Error('jugadoraId requerido');
  if (![true, false, null].includes(enPeriodo)) throw new Error('Estado de período inválido');

  const semanaClave = obtenerSemanaClave();
  const docId = `${jugadoraId}_${semanaClave}`;
  await setDoc(doc(db, SALUD_COLLECTION, docId), {
    jugadoraId,
    jugadoraNombre: (jugadoraNombre || '').toString().trim() || 'Sin nombre',
    equipo: (equipo || '').toString().trim().toLowerCase(),
    semanaClave,
    enPeriodo,
    periodoRespondido: true,
    updatedAt: serverTimestamp()
  }, { merge: true });
  return { id: docId, semanaClave, enPeriodo };
};
