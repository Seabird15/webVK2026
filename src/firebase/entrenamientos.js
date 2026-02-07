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
  getDoc
} from 'firebase/firestore';
import { db } from './config';

export const entrenamientos = ref([]);
export const isLoadingEntrenamientos = ref(false);
export const errorEntrenamientos = ref(null);

// Crear entrenamiento (admin)
export const crearEntrenamiento = async (entrenamientoData) => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;
  try {
    const docRef = await addDoc(collection(db, 'entrenamientos'), {
      ...entrenamientoData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const entrenamientoId = docRef.id;

    // Si es una convocatoria, crear inscripciones solo para las jugadoras convocadas
    if (entrenamientoData.esConvocatoria && entrenamientoData.jugadorasConvocadas && entrenamientoData.jugadorasConvocadas.length > 0) {
      try {
        const { crearInscripcionesConvocadas } = await import('./inscripciones');
        await crearInscripcionesConvocadas(entrenamientoId, entrenamientoData.jugadorasConvocadas);
      } catch (err) {
        // // console.error('Error creando inscripciones de convocatoria:', err);
      }
    } else {
      // Crear inscripciones pendientes para todas las jugadoras del equipo
      try {
        const { crearInscripcionesPendientes } = await import('./inscripciones');
        await crearInscripcionesPendientes(entrenamientoId, entrenamientoData.equipo);
      } catch (err) {
        // // console.error('Error creando inscripciones pendientes:', err);
        // No lanzar error, el entrenamiento ya fue creado exitosamente
      }
    }

    return {
      id: entrenamientoId,
      ...entrenamientoData
    };
  } catch (err) {
    // // console.error('Error creando entrenamiento:', err);
    errorEntrenamientos.value = err.message;
    throw err;
  } finally {
    isLoadingEntrenamientos.value = false;
  }
};

// Obtener TODOS los entrenamientos (sin filtro)
export const fetchTodosEntrenamientos = async () => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;
  try {
    const snapshot = await getDocs(collection(db, 'entrenamientos'));
    entrenamientos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return entrenamientos.value;
  } catch (err) {
    // // console.error('Error obteniendo entrenamientos:', err);
    errorEntrenamientos.value = err.message;
    return [];
  } finally {
    isLoadingEntrenamientos.value = false;
  }
};

// Obtener entrenamientos por equipo (incluye los de 'ambos')
export const fetchEntrenamientosPorEquipo = async (equipo) => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;
  try {
    // Si el equipo es 'ambos', solo obtener los entrenamientos marcados como 'ambos'
    if (equipo === 'ambos') {
      const q = query(
        collection(db, 'entrenamientos'),
        where('equipo', '==', 'ambos')
      );
      const snapshot = await getDocs(q);
      entrenamientos.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return entrenamientos.value;
    }
    
    // Para equipos específicos (ascenso/escuela), obtener los del equipo + los de ambos
    // Obtener entrenamientos específicos del equipo
    const q1 = query(
      collection(db, 'entrenamientos'),
      where('equipo', '==', equipo)
    );
    const snapshot1 = await getDocs(q1);
    
    // Obtener entrenamientos que son para ambos equipos
    const q2 = query(
      collection(db, 'entrenamientos'),
      where('equipo', '==', 'ambos')
    );
    const snapshot2 = await getDocs(q2);
    
    // Combinar ambos resultados
    const entrenamientosEquipo = snapshot1.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const entrenamientosAmbos = snapshot2.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    entrenamientos.value = [...entrenamientosEquipo, ...entrenamientosAmbos];
    return entrenamientos.value;
  } catch (err) {
    // // console.error('Error obteniendo entrenamientos:', err);
    errorEntrenamientos.value = err.message;
    return [];
  } finally {
    isLoadingEntrenamientos.value = false;
  }
};

// Actualizar entrenamiento (admin)
export const actualizarEntrenamiento = async (entrenamientoId, data) => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;
  try {
    await updateDoc(doc(db, 'entrenamientos', entrenamientoId), {
      ...data,
      updatedAt: new Date()
    });

    return true;
  } catch (err) {
    // // console.error('Error actualizando entrenamiento:', err);
    errorEntrenamientos.value = err.message;
    return false;
  } finally {
    isLoadingEntrenamientos.value = false;
  }
};

// Eliminar entrenamiento (admin)
export const eliminarEntrenamiento = async (entrenamientoId) => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;
  try {
    // Eliminar todas las inscripciones del entrenamiento
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId)
    );
    const snapshot = await getDocs(q);
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Eliminar el entrenamiento
    await deleteDoc(doc(db, 'entrenamientos', entrenamientoId));
    return true;
  } catch (err) {
    // // console.error('Error eliminando entrenamiento:', err);
    errorEntrenamientos.value = err.message;
    return false;
  } finally {
    isLoadingEntrenamientos.value = false;
  }
};
