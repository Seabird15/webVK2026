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
    // // console.log('inscribirseEntrenamiento llamado con:', { entrenamientoId, jugadoraId, jugadoraNombre });
    
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
      // // console.log('Actualizando inscripción existente:', docId, 'con nombre:', jugadoraNombre);
      await updateDoc(doc(db, 'inscripcionesEntrenamientos', docId), {
        estado: 'confirmada',
        jugadoraNombre: jugadoraNombre,
        updatedAt: new Date()
      });
      // // console.log('Inscripción actualizada correctamente');
    } else {
      // Si no existe, crear nueva inscripción confirmada
      // // console.log('Creando nueva inscripción con nombre:', jugadoraNombre);
      await addDoc(collection(db, 'inscripcionesEntrenamientos'), {
        entrenamientoId: entrenamientoId,
        jugadoraId: jugadoraId,
        jugadoraNombre: jugadoraNombre,
        estado: 'confirmada',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      // // console.log('Nueva inscripción creada');
    }

    return true;
  } catch (err) {
    // // console.error('Error inscribiéndose:', err);
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
    // // console.error('Error desinscribiéndose:', err);
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
    // // console.error('Error obteniendo inscripciones:', err);
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
    // // console.error('Error obteniendo inscripciones:', err);
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
    // // console.error('Error verificando inscripción:', err);
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
    // // console.error('Error obteniendo estado:', err);
    return null;
  }
};
// Escuchar cambios en tiempo real de inscripciones de un entrenamiento
export const escucharInscripcionesEntrenamiento = (entrenamientoId, callback, getEntrenamiento = null) => {
  const q = query(
    collection(db, 'inscripcionesEntrenamientos'),
    where('entrenamientoId', '==', entrenamientoId)
  );

  return onSnapshot(q, (snapshot) => {
    const inscritas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Obtener el entrenamiento actualizado si se pasó la función
    const entrenamiento = typeof getEntrenamiento === 'function' ? getEntrenamiento() : getEntrenamiento;
    
    // Filtrar pendientes: si es convocatoria, solo mostrar las convocadas
    let pendientesFiltradas = inscritas.filter(i => i.estado === 'pendiente');
    
    if (entrenamiento?.esConvocatoria && entrenamiento?.convocadas && Array.isArray(entrenamiento.convocadas)) {
      pendientesFiltradas = pendientesFiltradas.filter(i => {
        return entrenamiento.convocadas.includes(i.jugadoraId);
      });
    }
    
    // Organizar por estado
    const organizadas = {
      confirmadas: inscritas.filter(i => i.estado === 'confirmada'),
      bajas: inscritas.filter(i => i.estado === 'baja'),
      pendientes: pendientesFiltradas
    };
    
    callback(organizadas);
  }, (error) => {
    console.error('Error escuchando inscripciones:', error);
  });
};

// Crear inscripciones pendientes para todas las jugadoras del equipo
export const crearInscripcionesPendientes = async (entrenamientoId, equipo) => {
  try {
    // Importar la función para obtener jugadoras
    const { fetchJugadorasRegistradasPorEquipo } = await import('./jugadorasAuth');
    
    // Obtener todas las jugadoras del equipo
    const jugadoras = await fetchJugadorasRegistradasPorEquipo(equipo);
    // // console.log(`Creando inscripciones para ${jugadoras.length} jugadoras del equipo ${equipo}`);
    
    if (jugadoras.length === 0) {
      // // console.warn('No se encontraron jugadoras para el equipo:', equipo);
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
    // // console.log(`Creadas ${batch.length} inscripciones pendientes para entrenamiento ${entrenamientoId}`);
    return true;
  } catch (err) {
    // // console.error('Error creando inscripciones pendientes:', err);
    return false;
  }
};

// Crear inscripciones solo para jugadoras convocadas (convocatoria/nómina)
export const crearInscripcionesConvocadas = async (entrenamientoId, jugadorasConvocadas) => {
  try {
    // // console.log(`Creando inscripciones de convocatoria para ${jugadorasConvocadas.length} jugadoras`);
    
    if (jugadorasConvocadas.length === 0) {
      // // console.warn('No hay jugadoras convocadas');
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
    // // console.log(`Creadas ${batch.length} inscripciones de convocatoria para entrenamiento ${entrenamientoId}`);
    return true;
  } catch (err) {
    // // console.error('Error creando inscripciones de convocatoria:', err);
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
    // // console.error('Error inscribiendo jugadora:', err);
    errorInscripciones.value = err.message;
    return false;
  } finally {
    isLoadingInscripciones.value = false;
  }
};

// Sincronizar inscripciones de convocatoria al editar entrenamiento
export const sincronizarInscripcionesConvocatoria = async (entrenamientoId, jugadorasConvocadas) => {
  try {
    // Obtener todas las inscripciones actuales del entrenamiento
    const q = query(
      collection(db, 'inscripcionesEntrenamientos'),
      where('entrenamientoId', '==', entrenamientoId)
    );
    const snapshot = await getDocs(q);
    
    const inscripcionesActuales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Crear un Set de IDs de jugadoras convocadas para búsqueda rápida
    const idsConvocadas = new Set(jugadorasConvocadas.map(j => j.id));
    
    // Crear un Set de IDs de inscripciones actuales
    const idsInscritas = new Set(inscripcionesActuales.map(i => i.jugadoraId));

    // 1. Agregar inscripciones para jugadoras nuevas en la convocatoria
    const promesasAgregar = [];
    for (const jugadora of jugadorasConvocadas) {
      if (!idsInscritas.has(jugadora.id)) {
        // Crear nueva inscripción pendiente
        promesasAgregar.push(
          addDoc(collection(db, 'inscripcionesEntrenamientos'), {
            entrenamientoId: entrenamientoId,
            jugadoraId: jugadora.id,
            jugadoraNombre: jugadora.nombre,
            estado: 'pendiente',
            esConvocada: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        );
      }
    }

    // 2. Marcar inscripciones de jugadoras que ya no están convocadas
    const promesasActualizar = [];
    for (const inscripcion of inscripcionesActuales) {
      if (!idsConvocadas.has(inscripcion.jugadoraId)) {
        // Jugadora removida de la convocatoria
        // Solo eliminar si el estado es 'pendiente', de lo contrario solo quitar marca de convocada
        if (inscripcion.estado === 'pendiente') {
          promesasActualizar.push(
            deleteDoc(doc(db, 'inscripcionesEntrenamientos', inscripcion.id))
          );
        } else {
          // Si ya confirmó o se dio de baja, mantener el registro pero quitar marca de convocada
          promesasActualizar.push(
            updateDoc(doc(db, 'inscripcionesEntrenamientos', inscripcion.id), {
              esConvocada: false,
              updatedAt: new Date()
            })
          );
        }
      } else {
        // Jugadora sigue en la convocatoria, asegurar que tenga la marca
        promesasActualizar.push(
          updateDoc(doc(db, 'inscripcionesEntrenamientos', inscripcion.id), {
            esConvocada: true,
            updatedAt: new Date()
          })
        );
      }
    }

    // Ejecutar todas las promesas
    await Promise.all([...promesasAgregar, ...promesasActualizar]);
    
    return true;
  } catch (err) {
    console.error('Error sincronizando inscripciones de convocatoria:', err);
    return false;
  }
};

// Cambiar estado de inscripción (para admin)
export const cambiarEstadoInscripcion = async (inscripcionId, nuevoEstado) => {
  isLoadingInscripciones.value = true;
  errorInscripciones.value = null;
  try {
    const docRef = doc(db, 'inscripcionesEntrenamientos', inscripcionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      errorInscripciones.value = 'Inscripción no encontrada';
      return false;
    }

    // Actualizar estado
    await updateDoc(docRef, {
      estado: nuevoEstado,
      ...(nuevoEstado === 'pendiente' && { motivoBaja: '', fechaBaja: null }),
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
