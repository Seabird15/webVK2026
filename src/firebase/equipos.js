import { ref } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

export const equiposData = ref({});
export const isLoading = ref(false);
export const error = ref(null);

// Obtener todos los datos del sitio (equipos, jugadoras, etc)
export const cargarDatosEquipos = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // Por ahora, devolvemos los datos estáticos
    // Más adelante podemos conectar a Firestore
    return equiposData.value;
  } catch (err) {
    error.value = err.message;
    // // console.error('Error cargando datos:', err);
  } finally {
    isLoading.value = false;
  }
};

// Obtener jugadoras de un equipo desde Firestore
export const obtenerJugadorasDelEquipo = async (equipo) => {
  try {
    const q = query(collection(db, 'jugadoras'), where('equipo', '==', equipo));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    // // console.error('Error obteniendo jugadoras:', err);
    return [];
  }
};
