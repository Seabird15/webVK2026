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
import { authUser } from './auth';

export const entrenamientos = ref([]);
export const isLoadingEntrenamientos = ref(false);
export const errorEntrenamientos = ref(null);

const normalizarVotosMvp = (mvpVotos = []) => {
  if (!Array.isArray(mvpVotos)) return [];

  return mvpVotos
    .map((item) => ({
      nombre: (item?.nombre || '').toString().trim(),
      votos: Math.max(0, Number(item?.votos) || 0)
    }))
    .filter((item) => item.nombre)
    .sort((a, b) => b.votos - a.votos);
};

const normalizarNombreMvp = (nombre) => (nombre || '').toString().trim().toLowerCase();

const construirNombreJugadoraMvp = (jugadora = {}) => {
  const nombreCompleto = `${jugadora?.nombre || ''} ${jugadora?.apellido || ''}`.trim();
  return nombreCompleto || (jugadora?.displayName || '').toString().trim();
};

const perteneceEquipoMvp = (jugadora = {}, equipo = '') => {
  if (!equipo) return false;

  const equipoNormalizado = (equipo || '').toString().trim().toLowerCase();
  const equiposJugadora = Array.isArray(jugadora?.equipos)
    ? jugadora.equipos.map((item) => (item || '').toString().trim().toLowerCase())
    : [];

  if (equipoNormalizado === 'ambos') {
    return equiposJugadora.includes('ascenso')
      || equiposJugadora.includes('escuela')
      || ['ascenso', 'escuela', 'ambos'].includes((jugadora?.equipo || '').toString().trim().toLowerCase());
  }

  if (equiposJugadora.length > 0) {
    return equiposJugadora.includes(equipoNormalizado);
  }

  const equipoJugadora = (jugadora?.equipo || '').toString().trim().toLowerCase();
  if (equipoNormalizado === 'ascenso' || equipoNormalizado === 'escuela') {
    return equipoJugadora === equipoNormalizado || equipoJugadora === 'ambos';
  }

  return equipoJugadora === equipoNormalizado;
};

const obtenerJugadorasRegistradasParaMvp = async (equipo) => {
  if (!equipo) return [];

  const snapshot = await getDocs(collection(db, 'jugadoraRegistro'));
  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
    .filter((jugadora) => perteneceEquipoMvp(jugadora, equipo));
};

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
      mvpHabilitado: entrenamientoData?.mvpHabilitado === true,
      mvpCerrada: entrenamientoData?.mvpCerrada === true,
      mvpVotos: Array.isArray(entrenamientoData?.mvpVotos) ? normalizarVotosMvp(entrenamientoData.mvpVotos) : [],
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
      ...(Object.prototype.hasOwnProperty.call(data, 'mvpVotos') ? { mvpVotos: normalizarVotosMvp(data.mvpVotos) } : {}),
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

export const solicitarRecordatorioCorreoEntrenamiento = async (entrenamientoId) => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;

  try {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    await updateDoc(doc(db, 'entrenamientos', entrenamientoId), {
      emailReminderRequest: {
        requestId,
        requestedAt: new Date(),
        requestedByUid: authUser.value?.uid || null
      },
      updatedAt: new Date()
    });

    return {
      success: true,
      emailNotification: {
        status: 'queued',
        mode: 'recordatorio',
        source: 'manual',
        requestedByUid: authUser.value?.uid || null,
        updatedAt: new Date().toISOString()
      }
    };
  } catch (err) {
    errorEntrenamientos.value = err.message;
    throw err;
  } finally {
    isLoadingEntrenamientos.value = false;
  }
};

// Votar MVP en un partido/amistoso creado por admin
export const votarMvpEntrenamiento = async (entrenamientoId, jugadoraId, jugadoraNombre) => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;

  try {
    const idVotante = (jugadoraId || '').toString().trim();
    if (!idVotante) {
      throw new Error('No se pudo validar la jugadora que vota.');
    }

    const nombreVoto = (jugadoraNombre || '').toString().trim();
    if (!nombreVoto) {
      throw new Error('Debes seleccionar una jugadora para votar MVP.');
    }

    const entrenamientoRef = doc(db, 'entrenamientos', entrenamientoId);
    const entrenamientoSnap = await getDoc(entrenamientoRef);

    if (!entrenamientoSnap.exists()) {
      throw new Error('No se encontró el evento para registrar el voto.');
    }

    const entrenamiento = entrenamientoSnap.data();
    const tipo = (entrenamiento?.tipo || '').toLowerCase();

    if (!(tipo === 'partido' || tipo === 'amistoso')) {
      throw new Error('La votación MVP solo aplica para partidos o amistosos.');
    }

    const mvpRaw = entrenamiento?.mvpHabilitado;
    const mvpHabilitadoNormalizado = mvpRaw === undefined || mvpRaw === null
      ? true
      : (mvpRaw === true || mvpRaw === 'true' || mvpRaw === 1);

    if (!mvpHabilitadoNormalizado) {
      throw new Error('La votación MVP no está habilitada para este evento.');
    }

    if (entrenamiento?.mvpCerrada === true) {
      throw new Error('La votación MVP ya fue finalizada por administración.');
    }

    const votosRegistradosPorJugadora = (entrenamiento?.mvpVotantes && typeof entrenamiento.mvpVotantes === 'object')
      ? entrenamiento.mvpVotantes
      : {};

    if (votosRegistradosPorJugadora[idVotante]) {
      throw new Error('Tu voto MVP ya fue registrado y no se puede modificar.');
    }

    const inscripcionesSnap = await getDocs(
      query(
        collection(db, 'inscripcionesEntrenamientos'),
        where('entrenamientoId', '==', entrenamientoId)
      )
    );

    const jugadorasDisponiblesMvp = await obtenerJugadorasRegistradasParaMvp(entrenamiento?.equipo || '');
    const votanteValida = jugadorasDisponiblesMvp.some((jugadora) => jugadora?.id === idVotante);

    if (!votanteValida) {
      throw new Error('Solo las jugadoras del plantel pueden votar MVP en este evento.');
    }

    const nombreVotoNormalizado = normalizarNombreMvp(nombreVoto);
    const candidataInscrita = inscripcionesSnap.docs.some((docSnap) => {
      const data = docSnap.data() || {};
      const nombreInscrita = (data.jugadoraNombre || '').toString().trim().toLowerCase();
      return nombreInscrita === nombreVotoNormalizado;
    });

    if (!candidataInscrita) {
      throw new Error('Solo se puede votar por jugadoras inscritas en este evento.');
    }

    const votosActuales = normalizarVotosMvp(entrenamiento?.mvpVotos || []);
    const mapaVotos = {};

    votosActuales.forEach((item) => {
      mapaVotos[item.nombre] = item.votos;
    });

    mapaVotos[nombreVoto] = (mapaVotos[nombreVoto] || 0) + 1;

    const votosActualizados = Object.entries(mapaVotos)
      .map(([nombre, votos]) => ({ nombre, votos }))
      .filter((item) => item.votos > 0)
      .sort((a, b) => b.votos - a.votos);

    const mvpVotantesActualizados = {
      ...votosRegistradosPorJugadora,
      [idVotante]: nombreVoto
    };

    await updateDoc(entrenamientoRef, {
      mvpVotos: votosActualizados,
      mvpVotantes: mvpVotantesActualizados,
      updatedAt: new Date()
    });

    return {
      mvpVotos: votosActualizados,
      mvpVotantes: mvpVotantesActualizados
    };
  } catch (err) {
    errorEntrenamientos.value = err.message;
    throw err;
  } finally {
    isLoadingEntrenamientos.value = false;
  }
};

// Finalizar votación MVP (solo admin)
export const finalizarVotacionMvpEntrenamiento = async (entrenamientoId, mvpGanadoraFinal = '') => {
  isLoadingEntrenamientos.value = true;
  errorEntrenamientos.value = null;

  try {
    const entrenamientoRef = doc(db, 'entrenamientos', entrenamientoId);
    const entrenamientoSnap = await getDoc(entrenamientoRef);

    if (!entrenamientoSnap.exists()) {
      throw new Error('No se encontró el evento para finalizar la votación MVP.');
    }

    const entrenamiento = entrenamientoSnap.data();
    const tipo = (entrenamiento?.tipo || '').toLowerCase();

    if (!(tipo === 'partido' || tipo === 'amistoso')) {
      throw new Error('La votación MVP solo aplica para partidos o amistosos.');
    }

    const mvpRaw = entrenamiento?.mvpHabilitado;
    const mvpHabilitadoNormalizado = mvpRaw === undefined || mvpRaw === null
      ? true
      : (mvpRaw === true || mvpRaw === 'true' || mvpRaw === 1);

    if (!mvpHabilitadoNormalizado) {
      throw new Error('Este evento no tiene habilitada la votación MVP.');
    }

    if (entrenamiento?.mvpCerrada === true) {
      return true;
    }

    const votosNormalizados = normalizarVotosMvp(entrenamiento?.mvpVotos || []);
    const maxVotos = votosNormalizados.length > 0 ? (Number(votosNormalizados[0]?.votos) || 0) : 0;
    const lideresEmpatados = maxVotos > 0
      ? votosNormalizados.filter((item) => (Number(item?.votos) || 0) === maxVotos)
      : [];

    const ganadoraFinalRaw = (mvpGanadoraFinal || '').toString().trim();
    let ganadoraFinal = '';

    if (lideresEmpatados.length > 1) {
      if (!ganadoraFinalRaw) {
        throw new Error('Hay empate en MVP. Debes seleccionar la MVP final antes de cerrar la votación.');
      }

      const ganadoraValida = lideresEmpatados.find(
        (item) => (item?.nombre || '').toString().trim().toLowerCase() === ganadoraFinalRaw.toLowerCase()
      );

      if (!ganadoraValida) {
        throw new Error('La jugadora elegida no corresponde al empate de MVP.');
      }

      ganadoraFinal = ganadoraValida.nombre;
    } else if (lideresEmpatados.length === 1) {
      ganadoraFinal = lideresEmpatados[0].nombre;
    }

    await updateDoc(entrenamientoRef, {
      mvpCerrada: true,
      mvpCerradaAt: new Date(),
      mvpGanadoraFinal: ganadoraFinal,
      updatedAt: new Date()
    });

    return true;
  } catch (err) {
    errorEntrenamientos.value = err.message;
    throw err;
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
