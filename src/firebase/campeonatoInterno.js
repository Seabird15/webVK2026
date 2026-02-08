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
