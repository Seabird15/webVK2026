import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from './config';

const sugerenciasClubRef = collection(db, 'sugerenciasClub');

export const enviarSugerenciaClub = async ({ jugadoraId, nombre, apellido, equipo, mensaje }) => {
  const texto = (mensaje || '').toString().trim();

  if (!jugadoraId || !texto) {
    throw new Error('Falta información para enviar el mensaje.');
  }

  const documento = await addDoc(sugerenciasClubRef, {
    jugadoraId,
    nombre: (nombre || '').toString().trim(),
    apellido: (apellido || '').toString().trim(),
    equipo: (equipo || '').toString().trim(),
    mensaje: texto,
    estado: 'pendiente',
    likes: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    borrado: false
  });

  return documento.id;
};

export const escucharSugerenciasClub = (callback, onError) => {
  const consulta = query(sugerenciasClubRef, orderBy('createdAt', 'desc'));

  return onSnapshot(consulta, (snapshot) => {
    callback(snapshot.docs.map((snapshotDoc) => ({
      id: snapshotDoc.id,
      ...snapshotDoc.data(),
      createdAt: snapshotDoc.data().createdAt,
      updatedAt: snapshotDoc.data().updatedAt
    })));
  }, onError);
};

// Muro visible para todas las jugadoras: excluye mensajes borrados por el club
export const escucharMuroMensajesClub = (callback, onError) => {
  const consulta = query(sugerenciasClubRef, orderBy('createdAt', 'desc'));

  return onSnapshot(consulta, (snapshot) => {
    callback(snapshot.docs
      .map((snapshotDoc) => ({
        id: snapshotDoc.id,
        ...snapshotDoc.data(),
        likes: snapshotDoc.data().likes || []
      }))
      .filter((mensaje) => !mensaje.borrado));
  }, onError);
};

export const alternarLikeSugerenciaClub = async (id, jugadoraId, yaLeGustaba) => {
  if (!id || !jugadoraId) return;

  await updateDoc(doc(db, 'sugerenciasClub', id), {
    likes: yaLeGustaba ? arrayRemove(jugadoraId) : arrayUnion(jugadoraId)
  });
};

export const actualizarEstadoSugerenciaClub = async (id, estado) => {
  const estadoValido = ['pendiente', 'visto'];

  if (!estadoValido.includes(estado)) {
    throw new Error('Estado inválido');
  }

  await updateDoc(doc(db, 'sugerenciasClub', id), {
    estado,
    updatedAt: serverTimestamp(),
    vistoAt: estado === 'visto' ? serverTimestamp() : null
  });
};

export const eliminarSugerenciaClub = async (id) => {
  await deleteDoc(doc(db, 'sugerenciasClub', id));
};
