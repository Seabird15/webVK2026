import { 
  collection, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { db } from './config';
import { ref } from 'vue';

export const estadisticas = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Obtener estadísticas de jugadoras por equipo
export const obtenerEstadisticasPorEquipo = async (equipo) => {
  isLoading.value = true;
  error.value = null;
  try {
    const q = query(
      collection(db, 'jugadoras'),
      where('equipo', '==', equipo)
    );
    const snapshot = await getDocs(q);
    
    estadisticas.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      goles: doc.data().goles || 0,
      asistencias: doc.data().asistencias || 0
    }));
    
    return estadisticas.value;
  } catch (err) {
    error.value = err.message;
    console.error('Error obteniendo estadísticas:', err);
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Actualizar goles de una jugadora
export const actualizarGoles = async (jugadoraId, goles) => {
  try {
    const docRef = doc(db, 'jugadoras', jugadoraId);
    await updateDoc(docRef, {
      goles: parseInt(goles) || 0,
      updatedAt: new Date()
    });
    return true;
  } catch (err) {
    error.value = err.message;
    console.error('Error actualizando goles:', err);
    throw err;
  }
};

// Actualizar asistencias de una jugadora
export const actualizarAsistencias = async (jugadoraId, asistencias) => {
  try {
    const docRef = doc(db, 'jugadoras', jugadoraId);
    await updateDoc(docRef, {
      asistencias: parseInt(asistencias) || 0,
      updatedAt: new Date()
    });
    return true;
  } catch (err) {
    error.value = err.message;
    console.error('Error actualizando asistencias:', err);
    throw err;
  }
};
