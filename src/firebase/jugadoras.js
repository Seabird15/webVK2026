import { ref } from 'vue';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  where 
} from 'firebase/firestore';
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './config';

export const jugadoras = ref([]);
export const isLoading = ref(false);
export const error = ref(null);

// Obtener jugadoras por equipo
export const fetchJugadorasByEquipo = async (equipo) => {
  isLoading.value = true;
  error.value = null;
  try {
    const q = query(collection(db, 'jugadoras'), where('equipo', '==', equipo));
    const snapshot = await getDocs(q);
    jugadoras.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return jugadoras.value;
  } catch (err) {
    error.value = err.message;
    // // console.error('Error obteniendo jugadoras:', err);
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Subir foto a Storage
export const uploadFoto = async (file, jugadoraId) => {
  try {
    const filename = `jugadoras/${jugadoraId}/${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, filename);
    
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    
    return url;
  } catch (err) {
    error.value = `Error subiendo foto: ${err.message}`;
    // // console.error('Error en uploadFoto:', err);
    throw err;
  }
};

// Crear jugadora
export const crearJugadora = async (jugadoraData, fotoFile) => {
  isLoading.value = true;
  error.value = null;
  try {
    let fotoUrl = null;
    
    // Si hay foto, subirla primero
    if (fotoFile) {
      const tempId = Date.now().toString();
      fotoUrl = await uploadFoto(fotoFile, tempId);
    }
    
    const docRef = await addDoc(collection(db, 'jugadoras'), {
      ...jugadoraData,
      foto: fotoUrl || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      id: docRef.id,
      ...jugadoraData,
      foto: fotoUrl
    };
  } catch (err) {
    error.value = err.message;
    // // console.error('Error creando jugadora:', err);
    throw err;
  } finally {
    isLoading.value = false;
  }
};

// Actualizar jugadora
export const actualizarJugadora = async (jugadoraId, jugadoraData, nuevoFotoFile) => {
  isLoading.value = true;
  error.value = null;
  try {
    let fotoUrl = jugadoraData.foto;
    
    // Si hay nueva foto, subirla
    if (nuevoFotoFile) {
      fotoUrl = await uploadFoto(nuevoFotoFile, jugadoraId);
    }
    
    await updateDoc(doc(db, 'jugadoras', jugadoraId), {
      ...jugadoraData,
      foto: fotoUrl,
      updatedAt: new Date()
    });
    
    return { id: jugadoraId, ...jugadoraData, foto: fotoUrl };
  } catch (err) {
    error.value = err.message;
    // // console.error('Error actualizando jugadora:', err);
    throw err;
  } finally {
    isLoading.value = false;
  }
};

// Eliminar jugadora
export const eliminarJugadora = async (jugadoraId, fotoUrl) => {
  isLoading.value = true;
  error.value = null;
  try {
    // Eliminar documento de Firestore
    await deleteDoc(doc(db, 'jugadoras', jugadoraId));
    
    // Eliminar foto de Storage (si existe)
    if (fotoUrl) {
      try {
        const fileRef = storageRef(storage, fotoUrl);
        await deleteObject(fileRef);
      } catch (err) {
        // // console.warn('No se pudo eliminar la foto:', err);
      }
    }
    
    return true;
  } catch (err) {
    error.value = err.message;
    // // console.error('Error eliminando jugadora:', err);
    throw err;
  } finally {
    isLoading.value = false;
  }
};

// Obtener jugadoras por equipo y posición
export const obtenerJugadorasPorPosicion = async (equipo, posicion) => {
  try {
    const q = query(
      collection(db, 'jugadoras'), 
      where('equipo', '==', equipo),
      where('posicion', '==', posicion)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    // // console.error(`Error obteniendo ${posicion}:`, err);
    return [];
  }
};

// Obtener toda la estructura de un equipo (DT, PA, Porteras, Defensas, Medio)
export const obtenerEquipoCompleto = async (equipo) => {
  try {
    const [dt, pa, porteras, defensas, alas, medio, delanteras] = await Promise.all([
      obtenerJugadorasPorPosicion(equipo, 'Directora Técnica'),
      obtenerJugadorasPorPosicion(equipo, 'Preparador Porteras'),
      obtenerJugadorasPorPosicion(equipo, 'Portera'),
      obtenerJugadorasPorPosicion(equipo, 'Cierre'),
      obtenerJugadorasPorPosicion(equipo, 'Ala'),
      obtenerJugadorasPorPosicion(equipo, 'Medio'),
      obtenerJugadorasPorPosicion(equipo, 'Pívot')
    ]);

    return {
      directoraTecnica: dt[0] || null,
      preparadorPorteras: pa[0] || null,
      porteras: porteras,
      defensas: defensas,
      alas: alas,
      medio: medio,
      delanteras: delanteras
    };
  } catch (err) {
    // // console.error('Error obteniendo equipo completo:', err);
    return {
      directoraTecnica: null,
      preparadorPorteras: null,
      porteras: [],
      defensas: [],
      alas: [],
      medio: [],
      delanteras: []
    };
  }
};
