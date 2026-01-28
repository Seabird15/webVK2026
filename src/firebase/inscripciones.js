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
    console.log('inscribirseEntrenamiento llamado con:', { entrenamientoId, jugadoraId, jugadoraNombre });
    
    // Verificar si ya existe un registro
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId),
      where('jugadoraId', '==', jugadoraId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size > 0) {
      // Si ya existe, actualizar estado a confirmada
      const docId = snapshot.docs[0].id;
      console.log('Actualizando inscripción existente:', docId, 'con nombre:', jugadoraNombre);
      await updateDoc(doc(db, 'inscripcionesEntrenamientos', docId), {
        estado: 'confirmada',
        jugadoraNombre: jugadoraNombre,
        updatedAt: new Date()
      });
      console.log('Inscripción actualizada correctamente');
    } else {
      // Si no existe, crear nueva inscripción confirmada
      console.log('Creando nueva inscripción con nombre:', jugadoraNombre);
      await addDoc(collection(db, 'inscripcionesEntrenamientos'), {
        entrenamientoId: entrenamientoId,
        jugadoraId: jugadoraId,
        jugadoraNombre: jugadoraNombre,
        estado: 'confirmada',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Nueva inscripción creada');
    }

    return true;
  } catch (err) {
    console.error('Error inscribiéndose:', err);
    errorInscripciones.value = err.message;
    return false;
  } finally {
    isLoadingInscripciones.value = false;
  }
};

// Desuscribirse de entrenamiento (cambiar estado a baja)
export const desuscribirseEntrenamiento = async (entrenamientoId, jugadoraId, motivoBaja = '') => {
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

    // Cambiar estado a baja en lugar de eliminar
    const docId = snapshot.docs[0].id;
    await updateDoc(doc(db, 'inscripcionesEntrenamientos', docId), {
      estado: 'baja',
      motivoBaja: motivoBaja,
      fechaBaja: new Date(),
      updatedAt: new Date()
    });

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

// Crear inscripciones pendientes para todas las jugadoras del equipo
export const crearInscripcionesPendientes = async (entrenamientoId, equipo) => {
  try {
    // Importar la función para obtener jugadoras
    const { fetchJugadorasRegistradasPorEquipo } = await import('./jugadorasAuth');
    
    // Obtener todas las jugadoras del equipo
    const jugadoras = await fetchJugadorasRegistradasPorEquipo(equipo);
    console.log(`Creando inscripciones para ${jugadoras.length} jugadoras del equipo ${equipo}`);
    
    if (jugadoras.length === 0) {
      console.warn('No se encontraron jugadoras para el equipo:', equipo);
      return false;
    }
    
    // Crear inscripción pendiente para cada jugadora
    const batch = [];
    for (const jugadora of jugadoras) {
      // Verificar si ya existe una inscripción
      const q = query(
        collection(db, 'inscripcionesEntrenamientos'),
        where('entrenamientoId', '==', entrenamientoId),
        where('jugadoraId', '==', jugadora.id)
      );
      const existing = await getDocs(q);
      
      if (existing.size === 0) {
        // Solo crear si no existe
        const inscripcion = addDoc(collection(db, 'inscripcionesEntrenamientos'), {
          entrenamientoId: entrenamientoId,
          jugadoraId: jugadora.id,
          jugadoraNombre: `${jugadora.nombre} ${jugadora.apellido}`,
          estado: 'pendiente',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        batch.push(inscripcion);
      }
    }
    
    await Promise.all(batch);
    console.log(`Creadas ${batch.length} inscripciones pendientes para entrenamiento ${entrenamientoId}`);
    return true;
  } catch (err) {
    console.error('Error creando inscripciones pendientes:', err);
    return false;
  }
};

// Crear inscripciones solo para jugadoras convocadas (convocatoria/nómina)
export const crearInscripcionesConvocadas = async (entrenamientoId, jugadorasConvocadas) => {
  try {
    console.log(`Creando inscripciones de convocatoria para ${jugadorasConvocadas.length} jugadoras`);
    
    if (jugadorasConvocadas.length === 0) {
      console.warn('No hay jugadoras convocadas');
      return false;
    }
    
    // Crear inscripción pendiente para cada jugadora convocada
    const batch = [];
    for (const jugadora of jugadorasConvocadas) {
      // Verificar si ya existe una inscripción
      const q = query(
        collection(db, 'inscripcionesEntrenamientos'),
        where('entrenamientoId', '==', entrenamientoId),
        where('jugadoraId', '==', jugadora.id)
      );
      const existing = await getDocs(q);
      
      if (existing.size === 0) {
        // Solo crear si no existe
        const inscripcion = addDoc(collection(db, 'inscripcionesEntrenamientos'), {
          entrenamientoId: entrenamientoId,
          jugadoraId: jugadora.id,
          jugadoraNombre: jugadora.nombre,
          estado: 'pendiente',
          esConvocada: true, // Marcar que es parte de una convocatoria
          createdAt: new Date(),
          updatedAt: new Date()
        });
        batch.push(inscripcion);
      }
    }
    
    await Promise.all(batch);
    console.log(`Creadas ${batch.length} inscripciones de convocatoria para entrenamiento ${entrenamientoId}`);
    return true;
  } catch (err) {
    console.error('Error creando inscripciones de convocatoria:', err);
    return false;
  }
};

// Inscribir jugadora manualmente (admin)
export const inscribirJugadoraManual = async (entrenamientoId, jugadoraId, jugadoraNombre, estado = 'confirmada') => {
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
      errorInscripciones.value = 'La jugadora ya está inscrita en este entrenamiento';
      return false;
    }

    // Crear inscripción
    await addDoc(collection(db, 'inscripcionesEntrenamientos'), {
      entrenamientoId: entrenamientoId,
      jugadoraId: jugadoraId,
      jugadoraNombre: jugadoraNombre,
      estado: estado,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return true;
  } catch (err) {
    console.error('Error inscribiendo jugadora:', err);
    errorInscripciones.value = err.message;
    return false;
  } finally {
    isLoadingInscripciones.value = false;
  }
};
