import { 
  collection, 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { ref } from 'vue';

export const equiposCampeonato = ref({});
export const isLoading = ref(false);
export const error = ref(null);

// Referencia a la colección del campeonato interno
const CAMPEONATO_INTERNO_2026 = 'campeonato_interno_2026';

/**
 * Inicializar datos del campeonato si no existen
 */
export const inicializarCampeonato = async () => {
  const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'equipos');
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const datosIniciales = {
      verserkers: {
        nombre: 'Las Verserkers',
        color: 'cyan',
        capitana: 'Barby',
        logo: 'versekersLogo.jpeg',
        jugadoras: [
          { nombre: 'May', goles: 0 },
          { nombre: 'Barby', goles: 0, capitana: true },
          { nombre: 'Eve', goles: 0 },
          { nombre: 'Luna', goles: 0 },
          { nombre: 'Vale G', goles: 0 },
          { nombre: 'Pao', goles: 0 },
          { nombre: 'Ju', goles: 0 },
          { nombre: 'Mayo', goles: 0 },
          { nombre: 'Tania', goles: 0 },
          { nombre: 'Roxi', goles: 0 },
          { nombre: 'Tiare', goles: 0 },
          { nombre: 'Lore', goles: 0 },
          { nombre: 'Milla', goles: 0 }
        ]
      },
      internadas: {
        nombre: 'Inter Nadas',
        color: 'gray',
        capitana: 'Pau Motta',
        logo: 'internadasLogo.jpeg',
        jugadoras: [
          { nombre: 'Eli López', goles: 0 },
          { nombre: 'Jessi C', goles: 0 },
          { nombre: 'Chama', goles: 0 },
          { nombre: 'Vane', goles: 0 },
          { nombre: 'Franshe', goles: 0 },
          { nombre: 'Javi C', goles: 0 },
          { nombre: 'Natiluminati', goles: 0 },
          { nombre: 'Motta', goles: 0, capitana: true },
          { nombre: 'Mila', goles: 0 },
          { nombre: 'Jessi P', goles: 0 },
          { nombre: 'Francy', goles: 0 },
          { nombre: 'Valeria', goles: 0 },
          { nombre: 'Chica', goles: 0 }
        ]
      },
      siemprealpalo: {
        nombre: 'Siempre al Palo FC',
        color: 'red',
        capitana: 'Dany Farias',
        logo: 'siemprealpaloLogo.jpeg',
        jugadoras: [
          { nombre: 'Jose', goles: 0 },
          { nombre: 'Majo', goles: 0 },
          { nombre: 'Deisy', goles: 0 },
          { nombre: 'Cami', goles: 0 },
          { nombre: 'Mi', goles: 0 },
          { nombre: 'Liss', goles: 0 },
          { nombre: 'Ro', goles: 0 },
          { nombre: 'Ge', goles: 0 },
          { nombre: 'Eli O', goles: 0 },
          { nombre: 'Caro', goles: 0 },
          { nombre: 'Dani F', goles: 0, capitana: true },
          { nombre: 'Dani O', goles: 0 }
        ]
      },
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await setDoc(docRef, datosIniciales);
    return datosIniciales;
  }

  return docSnap.data();
};

/**
 * Obtener datos del campeonato
 */
export const obtenerDatosCampeonato = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'equipos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      equiposCampeonato.value = docSnap.data();
      return equiposCampeonato.value;
    } else {
      // Si no existe, inicializar
      const datosIniciales = await inicializarCampeonato();
      equiposCampeonato.value = datosIniciales;
      return datosIniciales;
    }
  } catch (err) {
    error.value = err.message;
    console.error('Error obteniendo datos del campeonato:', err);
    throw err;
  } finally {
    isLoading.value = false;
  }
};

/**
 * Escuchar cambios en tiempo real
 */
export const escucharCampeonato = (callback) => {
  const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'equipos');
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      equiposCampeonato.value = docSnap.data();
      if (callback) callback(docSnap.data());
    }
  }, (err) => {
    error.value = err.message;
    console.error('Error escuchando cambios:', err);
  });
};

/**
 * Actualizar goles de una jugadora
 */
export const actualizarGolesJugadora = async (equipoKey, jugadoraIndex, nuevoValorGoles) => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'equipos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      
      // Actualizar los goles de la jugadora específica
      if (datos[equipoKey] && datos[equipoKey].jugadoras[jugadoraIndex]) {
        datos[equipoKey].jugadoras[jugadoraIndex].goles = Math.max(0, nuevoValorGoles);
        datos.lastUpdated = new Date().toISOString();

        await updateDoc(docRef, datos);
        equiposCampeonato.value = datos;
        return true;
      }
    }
    return false;
  } catch (err) {
    error.value = err.message;
    console.error('Error actualizando goles:', err);
    throw err;
  }
};

/**
 * Agregar un gol a una jugadora
 */
export const agregarGol = async (equipoKey, jugadoraIndex) => {
  const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'equipos');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const datos = docSnap.data();
    const golesActuales = datos[equipoKey].jugadoras[jugadoraIndex].goles || 0;
    return await actualizarGolesJugadora(equipoKey, jugadoraIndex, golesActuales + 1);
  }
  return false;
};

/**
 * Restar un gol a una jugadora
 */
export const restarGol = async (equipoKey, jugadoraIndex) => {
  const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'equipos');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const datos = docSnap.data();
    const golesActuales = datos[equipoKey].jugadoras[jugadoraIndex].goles || 0;
    if (golesActuales > 0) {
      return await actualizarGolesJugadora(equipoKey, jugadoraIndex, golesActuales - 1);
    }
  }
  return false;
};

/**
 * Obtener tabla de goleadoras general (todas las jugadoras ordenadas por goles)
 */
export const obtenerTablaGoleadoras = async () => {
  try {
    const datos = await obtenerDatosCampeonato();
    const todasLasJugadoras = [];

    Object.keys(datos).forEach((equipoKey) => {
      if (datos[equipoKey].jugadoras) {
        datos[equipoKey].jugadoras.forEach((jugadora) => {
          if (jugadora.goles > 0) {
            todasLasJugadoras.push({
              ...jugadora,
              equipo: datos[equipoKey].nombre,
              equipoKey,
              color: datos[equipoKey].color
            });
          }
        });
      }
    });

    // Ordenar por goles descendente
    return todasLasJugadoras.sort((a, b) => b.goles - a.goles);
  } catch (err) {
    console.error('Error obteniendo tabla de goleadoras:', err);
    return [];
  }
};

/**
 * Calcular total de goles por equipo
 */
export const calcularTotalGoles = (equipoKey) => {
  if (!equiposCampeonato.value[equipoKey] || !equiposCampeonato.value[equipoKey].jugadoras) {
    return 0;
  }
  return equiposCampeonato.value[equipoKey].jugadoras.reduce((sum, j) => sum + (j.goles || 0), 0);
};

/**
 * Resetear todas las estadísticas (solo para admin)
 */
export const resetearEstadisticas = async () => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'equipos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      
      // Resetear goles a 0 para todas las jugadoras
      Object.keys(datos).forEach((equipoKey) => {
        if (datos[equipoKey].jugadoras) {
          datos[equipoKey].jugadoras.forEach((jugadora) => {
            jugadora.goles = 0;
          });
        }
      });

      datos.lastUpdated = new Date().toISOString();
      await updateDoc(docRef, datos);
      equiposCampeonato.value = datos;
      return true;
    }
    return false;
  } catch (err) {
    error.value = err.message;
    console.error('Error reseteando estadísticas:', err);
    throw err;
  }
};

/**
 * ================================
 * GESTIÓN DE PARTIDOS Y RESULTADOS
 * ================================
 */

/**
 * Inicializar partidos del campeonato si no existen
 */
export const inicializarPartidos = async () => {
  const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'partidos');
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const partidosIniciales = {
      partidos: [
        {
          id: 1,
          equipoLocal: 'internadas',
          equipoVisita: 'siemprealpalo',
          golesLocal: 0,
          golesVisita: 2,
          horario: '19:00 - 19:35',
          fecha: '2026-02-07',
          numeroFecha: 1,
          estado: 'FINALIZADO',
          goleadoras: []
        },
        {
          id: 2,
          equipoLocal: 'siemprealpalo',
          equipoVisita: 'verserkers',
          golesLocal: 1,
          golesVisita: 7,
          horario: '19:40 - 20:15',
          fecha: '2026-02-07',
          numeroFecha: 1,
          estado: 'FINALIZADO',
          goleadoras: []
        },
        {
          id: 3,
          equipoLocal: 'internadas',
          equipoVisita: 'verserkers',
          golesLocal: 5,
          golesVisita: 1,
          horario: '20:20 - 20:55',
          fecha: '2026-02-07',
          numeroFecha: 1,
          estado: 'FINALIZADO',
          goleadoras: []
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    await setDoc(docRef, partidosIniciales);
    return partidosIniciales;
  }

  return docSnap.data();
};

/**
 * Inicializar partidos de la Fecha 2
 */
export const inicializarFecha2 = async () => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'partidos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      
      // Verificar si ya existen partidos de fecha 2
      const tieneFecha2 = datos.partidos.some(p => p.numeroFecha === 2);
      if (tieneFecha2) {
        return { success: false, message: 'La Fecha 2 ya está inicializada' };
      }

      // Agregar partidos de Fecha 2
      const nuevoId = Math.max(...datos.partidos.map(p => p.id)) + 1;
      const partidosFecha2 = [
        {
          id: nuevoId,
          equipoLocal: 'siemprealpalo',
          equipoVisita: 'verserkers',
          golesLocal: 0,
          golesVisita: 0,
          horario: '20:00 - 20:35',
          fecha: '2026-02-14',
          numeroFecha: 2,
          estado: 'PROGRAMADO',
          goleadoras: []
        },
        {
          id: nuevoId + 1,
          equipoLocal: 'internadas',
          equipoVisita: 'verserkers',
          golesLocal: 0,
          golesVisita: 0,
          horario: '20:40 - 21:15',
          fecha: '2026-02-14',
          numeroFecha: 2,
          estado: 'PROGRAMADO',
          goleadoras: []
        },
        {
          id: nuevoId + 2,
          equipoLocal: 'internadas',
          equipoVisita: 'siemprealpalo',
          golesLocal: 0,
          golesVisita: 0,
          horario: '21:20 - 21:55',
          fecha: '2026-02-14',
          numeroFecha: 2,
          estado: 'PROGRAMADO',
          goleadoras: []
        }
      ];

      datos.partidos = [...datos.partidos, ...partidosFecha2];
      datos.lastUpdated = new Date().toISOString();

      await updateDoc(docRef, datos);
      return { success: true, message: 'Fecha 2 inicializada correctamente', partidos: partidosFecha2 };
    }
    return { success: false, message: 'No se encontró el documento de partidos' };
  } catch (err) {
    console.error('Error inicializando Fecha 2:', err);
    throw err;
  }
};

/**
 * Inicializar partidos de la Fecha 3
 */
export const inicializarFecha3 = async () => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'partidos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();

      const tieneFecha3 = datos.partidos.some(p => p.numeroFecha === 3);
      if (tieneFecha3) {
        return { success: false, message: 'La Fecha 3 ya está inicializada' };
      }

      const nuevoId = Math.max(...datos.partidos.map(p => p.id)) + 1;
      const partidosFecha3 = [
        {
          id: nuevoId,
          equipoLocal: 'verserkers',
          equipoVisita: 'internadas',
          golesLocal: 0,
          golesVisita: 0,
          horario: '20:00 - 20:35',
          fecha: '2026-02-21',
          numeroFecha: 3,
          estado: 'PROGRAMADO',
          goleadoras: []
        },
        {
          id: nuevoId + 1,
          equipoLocal: 'internadas',
          equipoVisita: 'siemprealpalo',
          golesLocal: 0,
          golesVisita: 0,
          horario: '20:40 - 21:15',
          fecha: '2026-02-21',
          numeroFecha: 3,
          estado: 'PROGRAMADO',
          goleadoras: []
        },
        {
          id: nuevoId + 2,
          equipoLocal: 'verserkers',
          equipoVisita: 'siemprealpalo',
          golesLocal: 0,
          golesVisita: 0,
          horario: '21:20 - 21:55',
          fecha: '2026-02-21',
          numeroFecha: 3,
          estado: 'PROGRAMADO',
          goleadoras: []
        }
      ];

      datos.partidos = [...datos.partidos, ...partidosFecha3];
      datos.lastUpdated = new Date().toISOString();

      await updateDoc(docRef, datos);
      return { success: true, message: 'Fecha 3 inicializada correctamente', partidos: partidosFecha3 };
    }
    return { success: false, message: 'No se encontró el documento de partidos' };
  } catch (err) {
    console.error('Error inicializando Fecha 3:', err);
    throw err;
  }
};

/**
 * Obtener todos los partidos
 */
export const obtenerPartidos = async () => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'partidos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().partidos || [];
    } else {
      const partidosIniciales = await inicializarPartidos();
      return partidosIniciales.partidos || [];
    }
  } catch (err) {
    console.error('Error obteniendo partidos:', err);
    throw err;
  }
};

/**
 * Actualizar resultado de un partido
 */
export const actualizarResultadoPartido = async (partidoId, golesLocal, golesVisita) => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'partidos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      const partidoIndex = datos.partidos.findIndex(p => p.id === partidoId);
      
      if (partidoIndex !== -1) {
        datos.partidos[partidoIndex].golesLocal = Math.max(0, golesLocal);
        datos.partidos[partidoIndex].golesVisita = Math.max(0, golesVisita);
        datos.lastUpdated = new Date().toISOString();

        await updateDoc(docRef, datos);
        
        // Recalcular tabla de posiciones
        await calcularTabla();
        
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('Error actualizando resultado:', err);
    throw err;
  }
};

/**
 * Calcular y guardar tabla de posiciones basada en los partidos
 */
export const calcularTabla = async () => {
  try {
    const partidos = await obtenerPartidos();
    
    // Inicializar tabla
    const tabla = {
      verserkers: { 
        nombre: 'Las Verserkers',
        logo: 'versekersLogo.jpeg',
        pj: 0, pg: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
        color: 'cyan'
      },
      internadas: { 
        nombre: 'Inter Nadas',
        logo: 'internadasLogo.jpeg',
        pj: 0, pg: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
        color: 'gray'
      },
      siemprealpalo: { 
        nombre: 'Siempre al Palo FC',
        logo: 'siemprealpaloLogo.jpeg',
        pj: 0, pg: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
        color: 'red'
      }
    };

    // Procesar cada partido
    partidos.forEach(partido => {
      if (partido.estado === 'FINALIZADO') {
        const local = partido.equipoLocal;
        const visita = partido.equipoVisita;
        const golesLocal = partido.golesLocal;
        const golesVisita = partido.golesVisita;

        // Actualizar estadísticas del equipo local
        tabla[local].pj++;
        tabla[local].gf += golesLocal;
        tabla[local].gc += golesVisita;

        // Actualizar estadísticas del equipo visitante
        tabla[visita].pj++;
        tabla[visita].gf += golesVisita;
        tabla[visita].gc += golesLocal;

        // Determinar resultado
        if (golesLocal > golesVisita) {
          // Victoria local
          tabla[local].pg++;
          tabla[local].pts += 3;
          tabla[visita].pp++;
        } else if (golesVisita > golesLocal) {
          // Victoria visitante
          tabla[visita].pg++;
          tabla[visita].pts += 3;
          tabla[local].pp++;
        }
      }
    });

    // Calcular diferencia de goles
    Object.keys(tabla).forEach(key => {
      tabla[key].dg = tabla[key].gf - tabla[key].gc;
    });

    // Ordenar tabla por puntos, diferencia de goles, goles a favor
    const tablaOrdenada = Object.entries(tabla)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        return b.gf - a.gf;
      });

    // Guardar tabla calculada
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'tabla');
    await setDoc(docRef, {
      posiciones: tablaOrdenada,
      lastUpdated: new Date().toISOString()
    });

    return tablaOrdenada;
  } catch (err) {
    console.error('Error calculando tabla:', err);
    throw err;
  }
};

/**
 * Obtener tabla de posiciones
 */
export const obtenerTabla = async () => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'tabla');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().posiciones || [];
    } else {
      // Si no existe, calcular por primera vez
      return await calcularTabla();
    }
  } catch (err) {
    console.error('Error obteniendo tabla:', err);
    throw err;
  }
};

/**
 * Escuchar cambios en partidos en tiempo real
 */
export const escucharPartidos = (callback) => {
  const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'partidos');
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      if (callback) callback(docSnap.data().partidos || []);
    }
  }, (err) => {
    console.error('Error escuchando partidos:', err);
  });
};

/**
 * Escuchar cambios en tabla en tiempo real
 */
export const escucharTabla = (callback) => {
  const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'tabla');
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      if (callback) callback(docSnap.data().posiciones || []);
    }
  }, (err) => {
    console.error('Error escuchando tabla:', err);
  });
};

/**
 * Obtener partidos agrupados por numeroFecha
 */
export const obtenerPartidosPorFecha = async () => {
  try {
    const partidos = await obtenerPartidos();
    const partidosPorFecha = {};
    
    partidos.forEach(partido => {
      // Usar numeroFecha si existe, sino asignar 1 por defecto
      const numeroFecha = partido.numeroFecha || 1;
      if (!partidosPorFecha[numeroFecha]) {
        partidosPorFecha[numeroFecha] = [];
      }
      partidosPorFecha[numeroFecha].push(partido);
    });
    
    return partidosPorFecha;
  } catch (err) {
    console.error('Error obteniendo partidos por fecha:', err);
    return {};
  }
};

/**
 * Actualizar estado de un partido
 */
export const actualizarEstadoPartido = async (partidoId, nuevoEstado) => {
  try {
    const docRef = doc(db, CAMPEONATO_INTERNO_2026, 'partidos');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      const partidoIndex = datos.partidos.findIndex(p => p.id === partidoId);
      
      if (partidoIndex !== -1) {
        datos.partidos[partidoIndex].estado = nuevoEstado;
        datos.lastUpdated = new Date().toISOString();

        await updateDoc(docRef, datos);
        
        // Si se finaliza un partido, recalcular tabla
        if (nuevoEstado === 'FINALIZADO') {
          await calcularTabla();
        }
        
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('Error actualizando estado:', err);
    throw err;
  }
};
