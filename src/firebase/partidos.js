/**
 * Gestión de partidos y resultados con actualización de estadísticas
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from './config';
import { ref } from 'vue';
import { actualizarContadorEstadistica } from './estadisticas';

export const partidos = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Crear o obtener referencia a un partido
export const obtenerPartido = async (id) => {
  try {
    const docRef = doc(db, 'partidos', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (err) {
    console.error('Error obteniendo partido:', err);
    throw err;
  }
};

// Crear un nuevo partido
export const crearPartido = async (datosPartido) => {
  try {
    const {
      fecha,
      hora,
      equipo, // 'ascenso' o 'escuela'
      tipo, // 'competicion', 'amistoso', 'liga'
      rival,
      lugar,
      golesLocal = 0,
      golesVisita = 0
    } = datosPartido;

    const nuevoPartido = {
      fecha: new Date(fecha),
      hora,
      equipo,
      tipo,
      rival: rival || 'Por confirmar',
      lugar: lugar || 'Por confirmar',
      golesLocal,
      golesVisita,
      goleadoresLocal: [], // Array de {jugadora: nombre, minuto: number}
      goleadoresVisita: [],
      estado: 'PROGRAMADO', // PROGRAMADO, EN_CURSO, FINALIZADO
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = doc(db, 'partidos', `${equipo}_${tipo}_${new Date(fecha).getTime()}`);
    await setDoc(docRef, nuevoPartido);
    return docRef.id;
  } catch (err) {
    error.value = err.message;
    console.error('Error creando partido:', err);
    throw err;
  }
};

// Actualizar resultado del partido (goles)
export const actualizarResultado = async (partidoId, golesLocal, golesVisita) => {
  try {
    const docRef = doc(db, 'partidos', partidoId);
    await updateDoc(docRef, {
      golesLocal,
      golesVisita,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    error.value = err.message;
    console.error('Error actualizando resultado:', err);
    throw err;
  }
};

// Registrar un gol y actualizar estadísticas
export const registrarGol = async (
  partidoId,
  equipo, // 'local' o 'visita'
  jugadoraNombre,
  minuto = 0
) => {
  try {
    const docRef = doc(db, 'partidos', partidoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Partido no encontrado');
    }

    const partidoData = docSnap.data();
    const nuevoGol = {
      jugadora: jugadoraNombre,
      minuto,
      timestamp: serverTimestamp()
    };

    // Determinar el campo a actualizar
    const campoGoles = equipo === 'local' ? 'golesLocal' : 'golesVisita';
    const campoGoleadores = equipo === 'local' ? 'goleadoresLocal' : 'goleadoresVisita';

    // Actualizar partido
    await updateDoc(docRef, {
      [campoGoles]: increment(1),
      [campoGoleadores]: arrayUnion(nuevoGol),
      updatedAt: serverTimestamp()
    });

    // Actualizar estadísticas de la jugadora
    await actualizarEstadisticaGol(
      jugadoraNombre,
      partidoData.equipo,
      partidoData.tipo
    );

    return true;
  } catch (err) {
    error.value = err.message;
    console.error('Error registrando gol:', err);
    throw err;
  }
};

// Deshacer un gol
export const deshacerGol = async (
  partidoId,
  equipo, // 'local' o 'visita'
  jugadoraNombre
) => {
  try {
    const docRef = doc(db, 'partidos', partidoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Partido no encontrado');
    }

    const partidoData = docSnap.data();
    const campoGoles = equipo === 'local' ? 'golesLocal' : 'golesVisita';
    const campoGoleadores = equipo === 'local' ? 'goleadoresLocal' : 'goleadoresVisita';

    // Obtener el array actual de goleadores
    const goleadores = partidoData[campoGoleadores] || [];
    
    // Encontrar el índice del gol a deshacer (último del jugadora)
    const indiceGol = goleadores.length - 1 - goleadores
      .slice()
      .reverse()
      .findIndex(g => g.jugadora === jugadoraNombre);

    if (indiceGol === -1) {
      throw new Error('Gol no encontrado para esta jugadora');
    }

    // Remover el gol
    const nuevoArray = goleadores.filter((_, i) => i !== indiceGol);

    // Actualizar partido
    if (nuevoArray.length === 0) {
      // Si no hay más goles, decrementar el contador y limpiar el array
      await updateDoc(docRef, {
        [campoGoles]: Math.max(0, (partidoData[campoGoles] || 1) - 1),
        [campoGoleadores]: [],
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(docRef, {
        [campoGoles]: Math.max(0, (partidoData[campoGoles] || 1) - 1),
        [campoGoleadores]: nuevoArray,
        updatedAt: serverTimestamp()
      });
    }

    // Actualizar estadísticas de la jugadora (decrementar)
    await decrementarEstadisticaGol(
      jugadoraNombre,
      partidoData.equipo,
      partidoData.tipo
    );

    return true;
  } catch (err) {
    error.value = err.message;
    console.error('Error deshaciendo gol:', err);
    throw err;
  }
};

// Registrar una asistencia
export const registrarAsistencia = async (
  partidoId,
  equipo, // 'local' o 'visita'
  jugadoraNombre,
  minuto = 0
) => {
  try {
    const docRef = doc(db, 'partidos', partidoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Partido no encontrado');
    }

    const partidoData = docSnap.data();
    const nuevaAsistencia = {
      jugadora: jugadoraNombre,
      minuto,
      timestamp: serverTimestamp()
    };

    // Determinar el campo a actualizar
    const campoAsistencias = equipo === 'local' ? 'asistenciasLocal' : 'asistenciasVisita';

    // Actualizar partido
    await updateDoc(docRef, {
      [campoAsistencias]: arrayUnion(nuevaAsistencia),
      updatedAt: serverTimestamp()
    });

    // Actualizar estadísticas de la jugadora
    await actualizarEstadisticaAsistencia(
      jugadoraNombre,
      partidoData.equipo,
      partidoData.tipo
    );

    return true;
  } catch (err) {
    error.value = err.message;
    console.error('Error registrando asistencia:', err);
    throw err;
  }
};

export const actualizarEstadisticaGol = async (jugadoraNombre, equipoPartido, tipoPartido, jugadoraId = null) => {
  try {
    await actualizarContadorEstadistica({
      equipo: equipoPartido,
      jugadoraId,
      jugadoraNombre,
      tipo: tipoPartido,
      campo: 'goles',
      delta: 1
    });
  } catch (err) {
    console.error('❌ Error actualizando estadística de gol:', err);
  }
};

export const decrementarEstadisticaGol = async (jugadoraNombre, equipoPartido, tipoPartido, jugadoraId = null) => {
  try {
    await actualizarContadorEstadistica({
      equipo: equipoPartido,
      jugadoraId,
      jugadoraNombre,
      tipo: tipoPartido,
      campo: 'goles',
      delta: -1
    });
  } catch (err) {
    console.error('Error decrementando gol de estadísticas:', err);
  }
};

export const decrementarEstadisticaAsistencia = async (jugadoraNombre, equipoPartido, tipoPartido, jugadoraId = null) => {
  try {
    await actualizarContadorEstadistica({
      equipo: equipoPartido,
      jugadoraId,
      jugadoraNombre,
      tipo: tipoPartido,
      campo: 'asistencias',
      delta: -1
    });
  } catch (err) {
    console.error('Error decrementando asistencia de estadísticas:', err);
  }
};

export const actualizarEstadisticaAsistencia = async (jugadoraNombre, equipoPartido, tipoPartido, jugadoraId = null) => {
  try {
    await actualizarContadorEstadistica({
      equipo: equipoPartido,
      jugadoraId,
      jugadoraNombre,
      tipo: tipoPartido,
      campo: 'asistencias',
      delta: 1
    });
  } catch (err) {
    console.error('❌ Error actualizando estadística de asistencia:', err);
  }
};

// Obtener partidos por equipo y tipo
export const obtenerPartidosPorEquipoTipo = async (equipo, tipo = null) => {
  isLoading.value = true;
  error.value = null;
  try {
    let q;
    if (tipo) {
      q = query(
        collection(db, 'partidos'),
        where('equipo', '==', equipo),
        where('tipo', '==', tipo)
      );
    } else {
      q = query(
        collection(db, 'partidos'),
        where('equipo', '==', equipo)
      );
    }

    const snapshot = await getDocs(q);
    partidos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return partidos.value;
  } catch (err) {
    error.value = err.message;
    console.error('Error obteniendo partidos:', err);
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Escuchar cambios en tiempo real
export const escucharPartidos = (equipo, tipo = null, callback) => {
  try {
    let q;
    if (tipo) {
      q = query(
        collection(db, 'partidos'),
        where('equipo', '==', equipo),
        where('tipo', '==', tipo)
      );
    } else {
      q = query(
        collection(db, 'partidos'),
        where('equipo', '==', equipo)
      );
    }

    return onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      partidos.value = datos;
      if (callback) callback(datos);
    }, (err) => {
      error.value = err.message;
      console.error('Error escuchando partidos:', err);
    });
  } catch (err) {
    console.error('Error configurando listener de partidos:', err);
  }
};
