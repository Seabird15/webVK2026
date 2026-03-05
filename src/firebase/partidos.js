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

// helper to compute Levenshtein distance between two strings
const levenshtein = (a = '', b = '') => {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
};

// Función auxiliar: actualizar estadísticas con gol (ahora con búsqueda difusa)
export const actualizarEstadisticaGol = async (jugadoraNombre, equipoPartido, tipoPartido) => {
  try {
    // LÓGICA: Solo ASCENSO AMISTOSOS va a estadisticasAscAmistosos
    // Todo lo demás (ASCENSO COMPETICIÓN, ESCUELA COMPETICIÓN, ESCUELA AMISTOSOS) va a estadisticas
const coleccionEstadisticas = (equipoPartido === 'ascenso' && tipoPartido === 'amistoso')
  ? 'estadisticasAscAmistosos'
  : 'estadisticas';


    // Intenta primero con filtro de equipo
    let q = query(
      collection(db, coleccionEstadisticas),
      where('equipo', '==', equipoPartido)
    );
    let snapshot = await getDocs(q);

    
    // Si no encuentra nada, busca SIN filtro de equipo en la misma colección
    if (snapshot.size === 0) {
      q = query(collection(db, coleccionEstadisticas));
      snapshot = await getDocs(q);
    }

    snapshot.docs.forEach((d, idx) => {
      const datos = d.data();
    });

    const nombreLower = jugadoraNombre.trim().toLowerCase().replace(/\s+/g, ' ');
    const nombreWords = nombreLower.split(/\s+/).filter(w => w);

    // Coleccionar todas las coincidencias con prioridad
    const coincidencias = {
      exacto: null,
      nombreExacto: null,
      parcial: null,
      levenshtein: null
    };

    snapshot.docs.forEach(d => {
      const data = d.data();
      const nombre = (data.nombre || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const apellido = (data.apellido || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const full = (nombre + ' ' + apellido).trim().replace(/\s+/g, ' ');


      // Nivel 1: Coincidencia exacta completa (incluyendo espacios normalizados)
      if (full === nombreLower && !coincidencias.exacto) {
        coincidencias.exacto = { id: d.id, data };
        return;
      }

      // Nivel 2: Primer nombre exacto (PRIORITARIO)
      if (!coincidencias.nombreExacto && (nombre === nombreLower || nombreWords[0] === nombre)) {
        coincidencias.nombreExacto = { id: d.id, data };
        return;
      }

      // Nivel 3: Búsqueda parcial
      if (!coincidencias.parcial) {
        if (full.includes(nombreLower) || nombreLower.includes(nombre)) {
          coincidencias.parcial = { id: d.id, data };
          return;
        }
      }

      // Nivel 4: Levenshtein como último recurso
      if (!coincidencias.levenshtein && nombreLower.length > 2) {
        const scoreNombre = levenshtein(nombre, nombreLower);
        const scoreFull = levenshtein(full, nombreLower);
        const score = Math.min(scoreNombre, scoreFull);
        const maxLen = Math.max(full.length, nombreLower.length);
        const threshold = Math.ceil(maxLen * 0.4);
        
        if (score <= threshold) {
          coincidencias.levenshtein = { id: d.id, data };
          return;
        }
      }
    });

    // Elegir la mejor coincidencia en orden de prioridad
    const mejorDoc = coincidencias.exacto || 
                     coincidencias.nombreExacto || 
                     coincidencias.parcial || 
                     coincidencias.levenshtein;

    if (mejorDoc) {
      const docRef = doc(db, coleccionEstadisticas, mejorDoc.id);
      const tipoMatch = coincidencias.exacto ? 'exacto' : 
                       coincidencias.nombreExacto ? 'nombreExacto' :
                       coincidencias.parcial ? 'parcial' : 'levenshtein';
      
      
      await updateDoc(docRef, {
        goles: increment(1),
        updatedAt: serverTimestamp()
      });
    } else {
      snapshot.docs.forEach((d, idx) => {
        const data = d.data();
      });
      const docRef = doc(collection(db, coleccionEstadisticas));
      const parts = jugadoraNombre.split(' ');
      await setDoc(docRef, {
        nombre: parts[0] || jugadoraNombre,
        apellido: parts[1] || '',
        equipo: equipoPartido,
        goles: 1,
        asistencias: 0,
        partidos: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.error('❌ Error actualizando estadística de gol:', err);
  }
};

// Función auxiliar: decrementar gol de estadísticas (uso difuso)
export const decrementarEstadisticaGol = async (jugadoraNombre, equipoPartido, tipoPartido) => {
  try {
    // LÓGICA: Solo ASCENSO AMISTOSOS va a estadisticasAscAmistosos
    const coleccionEstadisticas = (equipoPartido === 'ascenso' && tipoPartido === 'amistoso')
      ? 'estadisticasAscAmistosos'
      : 'estadisticas';

    // Intenta primero con filtro de equipo
    let q = query(
      collection(db, coleccionEstadisticas),
      where('equipo', '==', equipoPartido)
    );

    let snapshot = await getDocs(q);
    
    // Si no encuentra nada, busca SIN filtro de equipo
    if (snapshot.size === 0) {
      q = query(collection(db, coleccionEstadisticas));
      snapshot = await getDocs(q);
    }

    const nombreLower = jugadoraNombre.trim().toLowerCase().replace(/\s+/g, ' ');
    const nombreWords = nombreLower.split(/\s+/).filter(w => w);

    // Coleccionar coincidencias con prioridad
    const coincidencias = {
      exacto: null,
      nombreExacto: null,
      parcial: null,
      levenshtein: null
    };

    snapshot.docs.forEach(d => {
      const data = d.data();
      const nombre = (data.nombre || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const apellido = (data.apellido || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const full = (nombre + ' ' + apellido).trim().replace(/\s+/g, ' ');

      if (full === nombreLower && !coincidencias.exacto) {
        coincidencias.exacto = { id: d.id, data };
        return;
      }

      if (!coincidencias.nombreExacto && (nombre === nombreLower || nombreWords[0] === nombre)) {
        coincidencias.nombreExacto = { id: d.id, data };
        return;
      }

      if (!coincidencias.parcial) {
        if (full.includes(nombreLower) || nombreLower.includes(nombre)) {
          coincidencias.parcial = { id: d.id, data };
          return;
        }
      }

      if (!coincidencias.levenshtein && nombreLower.length > 2) {
        const scoreNombre = levenshtein(nombre, nombreLower);
        const scoreFull = levenshtein(full, nombreLower);
        const score = Math.min(scoreNombre, scoreFull);
        const maxLen = Math.max(full.length, nombreLower.length);
        const threshold = Math.ceil(maxLen * 0.4);
        
        if (score <= threshold) {
          coincidencias.levenshtein = { id: d.id, data };
          return;
        }
      }
    });

    const mejorDoc = coincidencias.exacto || 
                     coincidencias.nombreExacto || 
                     coincidencias.parcial || 
                     coincidencias.levenshtein;

    if (mejorDoc) {
      const docRef = doc(db, coleccionEstadisticas, mejorDoc.id);
      const actuales = mejorDoc.data.goles || 0;
      await updateDoc(docRef, {
        goles: Math.max(0, actuales - 1),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.error('Error decrementando gol de estadísticas:', err);
  }
};

// Función auxiliar: decrementar asistencias de estadísticas
export const decrementarEstadisticaAsistencia = async (jugadoraNombre, equipoPartido, tipoPartido) => {
  try {
    const coleccionEstadisticas = (equipoPartido === 'ascenso' && tipoPartido === 'amistoso')
      ? 'estadisticasAscAmistosos'
      : 'estadisticas';

    // Intenta primero con filtro de equipo
    let q = query(
      collection(db, coleccionEstadisticas),
      where('equipo', '==', equipoPartido)
    );
    let snapshot = await getDocs(q);

    // Si no encuentra nada, busca SIN filtro de equipo
    if (snapshot.size === 0) {
      q = query(collection(db, coleccionEstadisticas));
      snapshot = await getDocs(q);
    }

    const nombreLower = jugadoraNombre.trim().toLowerCase().replace(/\s+/g, ' ');
    const nombreWords = nombreLower.split(/\s+/).filter(w => w);

    const coincidencias = {
      exacto: null,
      nombreExacto: null,
      parcial: null,
      levenshtein: null
    };

    snapshot.docs.forEach(d => {
      const data = d.data();
      const nombre = (data.nombre || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const apellido = (data.apellido || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const full = (nombre + ' ' + apellido).trim().replace(/\s+/g, ' ');

      if (full === nombreLower && !coincidencias.exacto) {
        coincidencias.exacto = { id: d.id, data };
        return;
      }

      if (!coincidencias.nombreExacto && (nombre === nombreLower || nombreWords[0] === nombre)) {
        coincidencias.nombreExacto = { id: d.id, data };
        return;
      }

      if (!coincidencias.parcial) {
        if (full.includes(nombreLower) || nombreLower.includes(nombre)) {
          coincidencias.parcial = { id: d.id, data };
          return;
        }
      }

      if (!coincidencias.levenshtein && nombreLower.length > 2) {
        const scoreNombre = levenshtein(nombre, nombreLower);
        const scoreFull = levenshtein(full, nombreLower);
        const score = Math.min(scoreNombre, scoreFull);
        const maxLen = Math.max(full.length, nombreLower.length);
        const threshold = Math.ceil(maxLen * 0.4);
        
        if (score <= threshold) {
          coincidencias.levenshtein = { id: d.id, data };
          return;
        }
      }
    });

    const mejorDoc = coincidencias.exacto || 
                     coincidencias.nombreExacto || 
                     coincidencias.parcial || 
                     coincidencias.levenshtein;

    if (mejorDoc) {
      const docRef = doc(db, coleccionEstadisticas, mejorDoc.id);
      const actuales = mejorDoc.data.asistencias || 0;
      await updateDoc(docRef, {
        asistencias: Math.max(0, actuales - 1),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.error('Error decrementando asistencia de estadísticas:', err);
  }
};

// Función auxiliar: actualizar estadísticas con asistencia
export const actualizarEstadisticaAsistencia = async (jugadoraNombre, equipoPartido, tipoPartido) => {
  try {
    const coleccionEstadisticas = (equipoPartido === 'ascenso' && tipoPartido === 'amistoso')
      ? 'estadisticasAscAmistosos'
      : 'estadisticas';


    // Intenta primero con filtro de equipo
    let q = query(
      collection(db, coleccionEstadisticas),
      where('equipo', '==', equipoPartido)
    );
    let snapshot = await getDocs(q);

    // Si no encuentra nada, busca SIN filtro de equipo
    if (snapshot.size === 0) {
      q = query(collection(db, coleccionEstadisticas));
      snapshot = await getDocs(q);
    }

    const nombreLower = jugadoraNombre.trim().toLowerCase().replace(/\s+/g, ' ');
    const nombreWords = nombreLower.split(/\s+/).filter(w => w);

    const coincidencias = {
      exacto: null,
      nombreExacto: null,
      parcial: null,
      levenshtein: null
    };

    snapshot.docs.forEach(d => {
      const data = d.data();
      const nombre = (data.nombre || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const apellido = (data.apellido || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const full = (nombre + ' ' + apellido).trim().replace(/\s+/g, ' ');

      if (full === nombreLower && !coincidencias.exacto) {
        coincidencias.exacto = { id: d.id, data };
        return;
      }

      if (!coincidencias.nombreExacto && (nombre === nombreLower || nombreWords[0] === nombre)) {
        coincidencias.nombreExacto = { id: d.id, data };
        return;
      }

      if (!coincidencias.parcial) {
        if (full.includes(nombreLower) || nombreLower.includes(nombre)) {
          coincidencias.parcial = { id: d.id, data };
          return;
        }
      }

      if (!coincidencias.levenshtein && nombreLower.length > 2) {
        const scoreNombre = levenshtein(nombre, nombreLower);
        const scoreFull = levenshtein(full, nombreLower);
        const score = Math.min(scoreNombre, scoreFull);
        const maxLen = Math.max(full.length, nombreLower.length);
        const threshold = Math.ceil(maxLen * 0.4);
        
        if (score <= threshold) {
          coincidencias.levenshtein = { id: d.id, data };
          return;
        }
      }
    });

    const mejorDoc = coincidencias.exacto || 
                     coincidencias.nombreExacto || 
                     coincidencias.parcial || 
                     coincidencias.levenshtein;

    if (mejorDoc) {
      const docRef = doc(db, coleccionEstadisticas, mejorDoc.id);
      await updateDoc(docRef, {
        asistencias: increment(1),
        updatedAt: serverTimestamp()
      });
    } else {
      const docRef = doc(collection(db, coleccionEstadisticas));
      const parts = jugadoraNombre.split(' ');
      await setDoc(docRef, {
        nombre: parts[0] || jugadoraNombre,
        apellido: parts[1] || '',
        equipo: equipoPartido,
        goles: 0,
        asistencias: 1,
        partidos: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
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
