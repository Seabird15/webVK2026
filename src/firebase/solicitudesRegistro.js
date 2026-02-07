import { ref } from 'vue';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from './config';

export const solicitudes = ref([]);
export const isLoadingSolicitudes = ref(false);
export const errorSolicitudes = ref(null);

// Obtener todas las solicitudes pendientes
export const fetchSolicitudesPendientes = async () => {
  isLoadingSolicitudes.value = true;
  errorSolicitudes.value = null;
  try {
    const q = query(collection(db, 'jugadorasLogin'), where('estado', '==', 'pendiente'));
    const snapshot = await getDocs(q);
    solicitudes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return solicitudes.value;
  } catch (err) {
    // // console.error('Error obteniendo solicitudes:', err);
    errorSolicitudes.value = err.message;
    return [];
  } finally {
    isLoadingSolicitudes.value = false;
  }
};

// Obtener todas las solicitudes (pendientes, aprobadas, rechazadas)
export const fetchTodasSolicitudes = async () => {
  isLoadingSolicitudes.value = true;
  errorSolicitudes.value = null;
  try {
    const snapshot = await getDocs(collection(db, 'jugadorasLogin'));
    solicitudes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return solicitudes.value;
  } catch (err) {
    // // console.error('Error obteniendo solicitudes:', err);
    errorSolicitudes.value = err.message;
    return [];
  } finally {
    isLoadingSolicitudes.value = false;
  }
};

// Aprobar solicitud
export const aprobarSolicitud = async (uid, email) => {
  isLoadingSolicitudes.value = true;
  errorSolicitudes.value = null;
  try {
    // // console.log('Aprobando solicitud para uid:', uid);
    
    // Actualizar estado en jugadoras primero (es el documento principal)
    await updateDoc(doc(db, 'jugadoras', uid), {
      estado: 'aprobada',
      updatedAt: new Date()
    });
    // // console.log('Documento en jugadoras actualizado a aprobada');

    // Actualizar estado en jugadorasLogin
    await updateDoc(doc(db, 'jugadorasLogin', uid), {
      estado: 'aprobada',
      updatedAt: new Date()
    });
    // // console.log('Documento en jugadorasLogin actualizado a aprobada');

    // Actualizar lista local
    await fetchTodasSolicitudes();
    return true;
  } catch (err) {
    // // console.error('Error aprobando solicitud:', err);
    errorSolicitudes.value = err.message;
    return false;
  } finally {
    isLoadingSolicitudes.value = false;
  }
};

// Rechazar solicitud
export const rechazarSolicitud = async (uid, razon = '') => {
  isLoadingSolicitudes.value = true;
  errorSolicitudes.value = null;
  try {
    // Actualizar estado en jugadorasLogin
    await updateDoc(doc(db, 'jugadorasLogin', uid), {
      estado: 'rechazada',
      razonRechazo: razon,
      updatedAt: new Date()
    });

    // Actualizar estado en jugadoras
    await updateDoc(doc(db, 'jugadoras', uid), {
      estado: 'rechazada',
      razonRechazo: razon,
      updatedAt: new Date()
    });

    // Actualizar lista local
    await fetchTodasSolicitudes();
    return true;
  } catch (err) {
    // // console.error('Error rechazando solicitud:', err);
    errorSolicitudes.value = err.message;
    return false;
  } finally {
    isLoadingSolicitudes.value = false;
  }
};
