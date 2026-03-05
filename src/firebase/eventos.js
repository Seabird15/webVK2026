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
  orderBy
} from 'firebase/firestore';
import { db } from './config';

export const eventos = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Obtener eventos de un mes específico
export const obtenerEventosMes = async (year, month) => {
  isLoading.value = true;
  error.value = null;
  try {
    // Crear fechas de inicio y fin del mes
    const fechaInicio = new Date(year, month, 1);
    const fechaFin = new Date(year, month + 1, 0, 23, 59, 59);
    
    const q = query(
      collection(db, 'entrenamientos'),
      where('fecha', '>=', fechaInicio),
      where('fecha', '<=', fechaFin),
      orderBy('fecha', 'asc')
    );
    
    const snapshot = await getDocs(q);
    eventos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return eventos.value;
  } catch (err) {
    // // console.error('Error obteniendo eventos:', err);
    error.value = err.message;
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Obtener todos los eventos
export const obtenerTodosEventos = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const q = query(
      collection(db, 'entrenamientos'),
      orderBy('fecha', 'asc')
    );
    
    const snapshot = await getDocs(q);
    eventos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return eventos.value;
  } catch (err) {
    // // console.error('Error obteniendo eventos:', err);
    error.value = err.message;
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Crear evento
export const crearEvento = async (datos) => {
  try {
    // Convertir string de fecha a objeto Date
    const fecha = new Date(datos.fecha + 'T' + datos.hora);
    
    const evento = {
      titulo: datos.titulo,
      descripcion: datos.descripcion || '',
      fecha: fecha,
      hora: datos.hora,
      tipo: datos.tipo, // 'entrenamiento', 'partido', 'otro'
      equipo: datos.equipo || '', // 'ascenso', 'escuela', 'futsal'
      lugar: datos.lugar || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'entrenamientos'), evento);
    return docRef.id;
  } catch (err) {
    // // console.error('Error creando evento:', err);
    error.value = err.message;
    throw err;
  }
};

// Actualizar evento
export const actualizarEvento = async (id, datos) => {
  try {
    const fecha = new Date(datos.fecha + 'T' + datos.hora);
    
    const evento = {
      ...datos,
      fecha: fecha,
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, 'eventos', id), evento);
    return true;
  } catch (err) {
    // // console.error('Error actualizando evento:', err);
    error.value = err.message;
    throw err;
  }
};

// Eliminar evento
export const eliminarEvento = async (id) => {
  try {
    await deleteDoc(doc(db, 'eventos', id));
    return true;
  } catch (err) {
    // // console.error('Error eliminando evento:', err);
    error.value = err.message;
    throw err;
  }
};
