import { ref } from 'vue';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export const feedbacks = ref([]);
export const isLoadingFeedback = ref(false);
export const errorFeedback = ref(null);

// Obtener feedbacks de una jugadora
export const obtenerFeedbackJugadora = async (jugadoraId) => {
  try {
    isLoadingFeedback.value = true;
    const q = query(
      collection(db, 'feedbackJugadoras'),
      where('jugadoraId', '==', jugadoraId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    errorFeedback.value = err.message;
    console.error('Error obteniendo feedback:', err);
    return [];
  } finally {
    isLoadingFeedback.value = false;
  }
};

// Escuchar feedbacks en tiempo real
export const escucharFeedbackJugadora = (jugadoraId, callback) => {
  try {
    const q = query(
      collection(db, 'feedbackJugadoras'),
      where('jugadoraId', '==', jugadoraId),
      where('reaccion', '==', null) // Solo mostrar feedbacks sin responder
    );
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        feedbacks.value = data;
        callback(data);
      },
      (error) => {
        console.error('❌ Error en onSnapshot de feedback:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje:', error.message);
      }
    );
    
    return unsubscribe;
  } catch (err) {
    console.error('❌ Error configurando listener de feedback:', err);
    console.error('Stack:', err.stack);
    return () => {}; // Retornar función vacía para evitar errores
  }
};

// Crear un nuevo feedback
export const crearFeedback = async (jugadoraId, jugadoraNombre, mensaje, tipo = 'general') => {
  try {
    isLoadingFeedback.value = true;
    ('📤 Creando feedback para jugadoraId:', jugadoraId, 'Nombre:', jugadoraNombre);
    const docRef = await addDoc(collection(db, 'feedbackJugadoras'), {
      jugadoraId,
      jugadoraNombre,
      mensaje,
      tipo,
      createdAt: serverTimestamp(),
      leido: false,
      reaccion: null, // null | 'confirmado' | 'revisar' | 'pregunta'
      reaccionadoAt: null
    });
    
    errorFeedback.value = null;
    return docRef.id;
  } catch (err) {
    errorFeedback.value = err.message;
    console.error('Error creando feedback:', err);
    throw err;
  } finally {
    isLoadingFeedback.value = false;
  }
};

// Marcar feedback como leído
export const marcarFeedbackComoLeido = async (feedbackId) => {
  try {
    await updateDoc(doc(db, 'feedbackJugadoras', feedbackId), {
      leido: true
    });
    errorFeedback.value = null;
  } catch (err) {
    errorFeedback.value = err.message;
    console.error('Error marcando feedback como leído:', err);
    throw err;
  }
};

// Agregar reacción a un feedback
export const agregarReaccionFeedback = async (feedbackId, reaccion) => {
  try {
    if (!['confirmado', 'revisar', 'pregunta'].includes(reaccion)) {
      throw new Error('Reacción inválida');
    }
    
    
    // Actualizar: marcar como leído + guardar reacción + timestamp de respuesta
    await updateDoc(doc(db, 'feedbackJugadoras', feedbackId), {
      leido: true,
      reaccion,
      reaccionadoAt: serverTimestamp()
    });
    
    errorFeedback.value = null;
  } catch (err) {
    errorFeedback.value = err.message;
    console.error('Error agregando reacción:', err);
    throw err;
  }
};

// Eliminar feedback (solo admin)
export const eliminarFeedback = async (feedbackId) => {
  try {
    await deleteDoc(doc(db, 'feedbackJugadoras', feedbackId));
    errorFeedback.value = null;
  } catch (err) {
    errorFeedback.value = err.message;
    console.error('Error eliminando feedback:', err);
    throw err;
  }
};

// Obtener feedbacks pendientes de una jugadora
export const obtenerFeedbacksPendientes = async (jugadoraId) => {
  try {
    const q = query(
      collection(db, 'feedbackJugadoras'),
      where('jugadoraId', '==', jugadoraId),
      where('leido', '==', false)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error obteniendo feedbacks pendientes:', err);
    return [];
  }
};

// Obtener todos los feedbacks enviados (para admin ver respuestas)
export const obtenerTodosFeedbacks = async () => {
  try {
    isLoadingFeedback.value = true;
    const snapshot = await getDocs(collection(db, 'feedbackJugadoras'));
    const feedbacksData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Ordenar por fecha de creación descendente (más nuevos primero)
    return feedbacksData.sort((a, b) => {
      const fechaA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
      const fechaB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
      return fechaB - fechaA;
    });
  } catch (err) {
    console.error('Error obteniendo todos los feedbacks:', err);
    return [];
  } finally {
    isLoadingFeedback.value = false;
  }
};

// Eliminar feedbacks más antiguos que X días
export const limpiarFeedbacksAntiguos = async (diasMaximo = 2) => {
  try {
    const snapshot = await getDocs(collection(db, 'feedbackJugadoras'));
    const ahora = Date.now();
    const diasMs = diasMaximo * 24 * 60 * 60 * 1000;
    
    let eliminados = 0;
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Si tiene reacción (fue respondido), usar reaccionadoAt
      // Si no tiene reacción, usar createdAt
      const fechaBase = data.reaccion 
        ? (data.reaccionadoAt?.seconds ? data.reaccionadoAt.seconds * 1000 : 0)
        : (data.createdAt?.seconds ? data.createdAt.seconds * 1000 : 0);
      
      const diferencia = ahora - fechaBase;
      
      if (diferencia > diasMs) {
        await deleteDoc(doc.ref);
        eliminados++;
      }
    }
    
    return eliminados;
  } catch (err) {
    console.error('Error limpiando feedbacks antiguos:', err);
    return 0;
  }
};

// Escuchar TODOS los feedbacks en tiempo real (para admin ver respuestas)
export const escucharTodosFeedbacks = (callback) => {
  try {
    const q = query(
      collection(db, 'feedbackJugadoras')
    );
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Ordenar por fecha de creación descendente (más nuevos primero)
        .sort((a, b) => {
          const fechaA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
          const fechaB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
          return fechaB - fechaA;
        });
        callback(data);
      },
      (error) => {
        console.error('❌ Error en onSnapshot de todos los feedbacks:', error);
      }
    );
    
    return unsubscribe;
  } catch (err) {
    console.error('❌ Error configurando listener de todos los feedbacks:', err);
    return () => {};
  }
};
