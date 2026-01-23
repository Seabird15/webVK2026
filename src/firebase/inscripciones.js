import { ref } from 'vue';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

export const inscripciones = ref([]);
export const isLoadingInscripciones = ref(false);
export const errorInscripciones = ref(null);

// Inscribir jugadora a entrenamiento
export const inscribirseEntrenamiento = async (entrenamientoId, jugadoraId, jugadoraNombre) => {
  isLoadingInscripciones.value = true;
  errorInscripciones.value = null;
  try {
    // Verificar si ya está inscrita
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId),
      where('jugadoraId', '==', jugadoraId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size > 0) {
      errorInscripciones.value = 'Ya estás inscrita en este entrenamiento';
      return false;
    }

    // Crear inscripción
    await addDoc(collection(db, 'inscripcionesEntrenamientos'), {
      entrenamientoId: entrenamientoId,
      jugadoraId: jugadoraId,
      jugadoraNombre: jugadoraNombre,
      estado: 'confirmada',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return true;
  } catch (err) {
    console.error('Error inscribiéndose:', err);
    errorInscripciones.value = err.message;
    return false;
  } finally {
    isLoadingInscripciones.value = false;
  }
};

// Desuscribirse de entrenamiento
export const desuscribirseEntrenamiento = async (entrenamientoId, jugadoraId) => {
  isLoadingInscripciones.value = true;
  errorInscripciones.value = null;
  try {
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId),
      where('jugadoraId', '==', jugadoraId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size === 0) {
      errorInscripciones.value = 'No estás inscrita en este entrenamiento';
      return false;
    }

    // Eliminar inscripción
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }

    return true;
  } catch (err) {
    console.error('Error desinscribiéndose:', err);
    errorInscripciones.value = err.message;
    return false;
  } finally {
    isLoadingInscripciones.value = false;
  }
};

// Obtener inscripciones de una jugadora
export const fetchInscripcionesJugadora = async (jugadoraId) => {
  isLoadingInscripciones.value = true;
  errorInscripciones.value = null;
  try {
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('jugadoraId', '==', jugadoraId)
    );
    const snapshot = await getDocs(q);
    inscripciones.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return inscripciones.value;
  } catch (err) {
    console.error('Error obteniendo inscripciones:', err);
    errorInscripciones.value = err.message;
    return [];
  } finally {
    isLoadingInscripciones.value = false;
  }
};

// Obtener inscripciones de un entrenamiento
export const fetchInscripcionesEntrenamiento = async (entrenamientoId) => {
  isLoadingInscripciones.value = true;
  errorInscripciones.value = null;
  try {
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId)
    );
    const snapshot = await getDocs(q);
    inscripciones.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return inscripciones.value;
  } catch (err) {
    console.error('Error obteniendo inscripciones:', err);
    errorInscripciones.value = err.message;
    return [];
  } finally {
    isLoadingInscripciones.value = false;
  }
};

// Verificar si jugadora está inscrita
export const estaInscrita = async (entrenamientoId, jugadoraId) => {
  try {
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId),
      where('jugadoraId', '==', jugadoraId)
    );
    const snapshot = await getDocs(q);
    return snapshot.size > 0;
  } catch (err) {
    console.error('Error verificando inscripción:', err);
    return false;
  }
};

// Obtener estado de inscripción
export const obtenerEstadoInscripcion = async (entrenamientoId, jugadoraId) => {
  try {
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId),
      where('jugadoraId', '==', jugadoraId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.size > 0) {
      return snapshot.docs[0].data().estado || 'confirmada';
    }
    return null;
  } catch (err) {
    console.error('Error obteniendo estado:', err);
    return null;
  }
};
// Escuchar cambios en tiempo real de inscripciones de un entrenamiento
export const escucharInscripcionesEntrenamiento = (entrenamientoId, callback) => {
  const q = query(
    collection(db, 'inscripcionesEntrenamientos'),
    where('entrenamientoId', '==', entrenamientoId)
  );

  return onSnapshot(q, (snapshot) => {
    const inscritas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Organizar por estado
    const organizadas = {
      confirmadas: inscritas.filter(i => i.estado === 'confirmada'),
      bajas: inscritas.filter(i => i.estado === 'baja'),
      pendientes: inscritas.filter(i => i.estado === 'pendiente')
    };
    
    callback(organizadas);
  }, (error) => {
    console.error('Error escuchando inscripciones:', error);
  });
};

// Cambiar estado de una inscripción (para admin)
export const cambiarEstadoInscripcion = async (inscripcionId, nuevoEstado) => {
  isLoadingInscripciones.value = true;
  errorInscripciones.value = null;
  try {
    await updateDoc(doc(db, 'inscripcionesEntrenamientos', inscripcionId), {
      estado: nuevoEstado,
      updatedAt: new Date()
    });
    return true;
  } catch (err) {
    console.error('Error cambiando estado:', err);
    errorInscripciones.value = err.message;
    return false;
  } finally {
    isLoadingInscripciones.value = false;
  }
};
