import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, default as app } from './config';

const functions = getFunctions(app);
const mensajesRef = collection(db, 'mensajesContacto');

export const enviarMensajeContacto = async (datos) => {
  const callable = httpsCallable(functions, 'submitContactMessage');
  const respuesta = await callable(datos);
  return respuesta.data;
};

export const escucharMensajesContacto = (callback, onError) => {
  const consulta = query(mensajesRef, orderBy('createdAt', 'desc'));
  return onSnapshot(consulta, (snapshot) => {
    callback(snapshot.docs.map((snapshotDoc) => ({
      id: snapshotDoc.id,
      ...snapshotDoc.data()
    })));
  }, onError);
};

export const actualizarEstadoMensajeContacto = (mensajeId, estado) => updateDoc(
  doc(db, 'mensajesContacto', mensajeId),
  { estado, updatedAt: new Date() }
);
