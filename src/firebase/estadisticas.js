import { 
  collection, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc,
  addDoc,
  deleteDoc 
} from 'firebase/firestore';
import { db } from './config';
import { ref } from 'vue';

export const estadisticas = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Obtener estadísticas por equipo
export const obtenerEstadisticasPorEquipo = async (equipo) => {
  isLoading.value = true;
  error.value = null;
  try {
    const q = query(
      collection(db, 'estadisticas'),
      where('equipo', '==', equipo)
    );
    const snapshot = await getDocs(q);
    
    estadisticas.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return estadisticas.value;
  } catch (err) {
    error.value = err.message;
    // // console.error('Error obteniendo estadísticas:', err);
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Agregar nueva jugadora a estadísticas
export const agregarEstadistica = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'estadisticas'), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (err) {
    error.value = err.message;
    // // console.error('Error agregando estadística:', err);
    throw err;
  }
};

// Actualizar estadística existente
export const actualizarEstadistica = async (id, data) => {
  try {
    const docRef = doc(db, 'estadisticas', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    return true;
  } catch (err) {
    error.value = err.message;
    // // console.error('Error actualizando estadística:', err);
    throw err;
  }
};

// Eliminar estadística
export const eliminarEstadistica = async (id) => {
  try {
    await deleteDoc(doc(db, 'estadisticas', id));
    return true;
  } catch (err) {
    error.value = err.message;
    // // console.error('Error eliminando estadística:', err);
    throw err;
  }
};
