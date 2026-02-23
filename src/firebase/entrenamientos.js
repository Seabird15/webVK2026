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
  onSnapshot,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

export const entrenamientos = ref([]);
export const isLoadingEntrenamientos = ref(false);
export const errorEntrenamientos = ref(null);

const limpiarProximoPartidoHome = async (entrenamientoIdActivo = null) => {
  const q = query(
    collection(db, 'entrenamientos'),
    where('mostrarEnProximoPartido', '==', true)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  let cambios = 0;

  snapshot.docs.forEach((docSnap) => {
    if (docSnap.id !== entrenamientoIdActivo) {
      batch.update(docSnap.ref, {
        mostrarEnProximoPartido: false,
        updatedAt: new Date()
      });
      cambios++;
    }
  });

  if (cambios > 0) {
    await batch.commit();
  }
};

const actualizarConfigProximoPartidoHome = async (entrenamientoId, entrenamientoData) => {
  await setDoc(doc(db, 'configuracion', 'proximoPartidoHome'), {
    entrenamientoId,
    activo: true,
    nombre: entrenamientoData?.nombre || '',
    tipo: entrenamientoData?.tipo || '',
    rival: entrenamientoData?.rival || '',
    fecha: entrenamientoData?.fecha || '',
    hora: entrenamientoData?.hora || '',
    lugar: entrenamientoData?.lugar || '',
    descripcion: entrenamientoData?.descripcion || '',
    equipo: entrenamientoData?.equipo || '',
    updatedAt: new Date()
  }, { merge: true });
};

const limpiarConfigProximoPartidoHomeSiCorresponde = async (entrenamientoId) => {
  const refConfig = doc(db, 'configuracion', 'proximoPartidoHome');
  const snap = await getDoc(refConfig);
  if (!snap.exists()) return;

  const data = snap.data();
  if (data?.entrenamientoId === entrenamientoId) {
    await setDoc(refConfig, {
      activo: false,
      updatedAt: new Date()
    }, { merge: true });
  }
};

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

    if (entrenamientoData.mostrarEnProximoPartido) {
      await limpiarProximoPartidoHome(entrenamientoId);
      await actualizarConfigProximoPartidoHome(entrenamientoId, entrenamientoData);
    }

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

    if (data.mostrarEnProximoPartido) {
      await limpiarProximoPartidoHome(entrenamientoId);
      await actualizarConfigProximoPartidoHome(entrenamientoId, data);
    } else {
      await limpiarConfigProximoPartidoHomeSiCorresponde(entrenamientoId);
    }

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

// Escuchar entrenamientos por equipo en tiempo real
export const escucharEntrenamientosPorEquipo = (equipo, callback) => {
  let unsubscribers = [];
  
  // Si el equipo es 'ambos', solo escuchar los entrenamientos marcados como 'ambos'
  if (equipo === 'ambos') {
    const q = query(
      collection(db, 'entrenamientos'),
      where('equipo', '==', 'ambos')
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      entrenamientos.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (callback) callback(entrenamientos.value);
    }, (error) => {
      errorEntrenamientos.value = error.message;
    });
    
    return unsub;
  }
  
  // Para equipos específicos, escuchar tanto el equipo como 'ambos'
  const entrenamientosMap = new Map();
  
  const actualizarEntrenamientos = () => {
    entrenamientos.value = Array.from(entrenamientosMap.values());
    if (callback) callback(entrenamientos.value);
  };
  
  // Listener para entrenamientos del equipo específico
  const q1 = query(
    collection(db, 'entrenamientos'),
    where('equipo', '==', equipo)
  );
  
  const unsub1 = onSnapshot(q1, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        entrenamientosMap.set(change.doc.id, {
          id: change.doc.id,
          ...change.doc.data()
        });
      } else if (change.type === 'removed') {
        entrenamientosMap.delete(change.doc.id);
      }
    });
    actualizarEntrenamientos();
  }, (error) => {
    errorEntrenamientos.value = error.message;
  });
  
  unsubscribers.push(unsub1);
  
  // Listener para entrenamientos de 'ambos'
  const q2 = query(
    collection(db, 'entrenamientos'),
    where('equipo', '==', 'ambos')
  );
  
  const unsub2 = onSnapshot(q2, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        entrenamientosMap.set(change.doc.id, {
          id: change.doc.id,
          ...change.doc.data()
        });
      } else if (change.type === 'removed') {
        entrenamientosMap.delete(change.doc.id);
      }
    });
    actualizarEntrenamientos();
  }, (error) => {
    errorEntrenamientos.value = error.message;
  });
  
  unsubscribers.push(unsub2);
  
  // Retornar función para desuscribirse de ambos listeners
  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};

// Escuchar TODOS los entrenamientos en tiempo real (sin filtro de equipo)
export const escucharTodosEntrenamientos = (callback) => {
  const q = query(collection(db, 'entrenamientos'));
  
  return onSnapshot(q, (snapshot) => {
    entrenamientos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    if (callback) callback(entrenamientos.value);
  }, (error) => {
    errorEntrenamientos.value = error.message;
  });
};
