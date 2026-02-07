import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';

// Crear galería/sección
export const crearGaleria = async (datos) => {
  try {
    const docRef = await addDoc(collection(db, 'galerias'), {
      titulo: datos.titulo,
      descripcion: datos.descripcion || '',
      fotos: datos.fotos || [],
      orden: datos.orden || 0,
      activa: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    // // console.error('Error al crear galería:', error);
    throw error;
  }
};

// Obtener todas las galerías
export const obtenerGalerias = async () => {
  try {
    const q = query(collection(db, 'galerias'), orderBy('orden', 'asc'));
    const querySnapshot = await getDocs(q);
    const galerias = [];
    querySnapshot.forEach((doc) => {
      galerias.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return galerias;
  } catch (error) {
    // // console.error('Error al obtener galerías:', error);
    throw error;
  }
};

// Actualizar galería
export const actualizarGaleria = async (id, datos) => {
  try {
    const docRef = doc(db, 'galerias', id);
    await updateDoc(docRef, {
      ...datos,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    // // console.error('Error al actualizar galería:', error);
    throw error;
  }
};

// Eliminar galería
export const eliminarGaleria = async (id) => {
  try {
    // Eliminar fotos de storage primero
    const galeriaRef = doc(db, 'galerias', id);
    const galeriaSnap = await getDocs(collection(db, 'galerias'));
    
    for (const docSnap of galeriaSnap.docs) {
      if (docSnap.id === id) {
        const fotos = docSnap.data().fotos || [];
        for (const foto of fotos) {
          try {
            const photoRef = storageRef(storage, foto.url);
            await deleteObject(photoRef);
          } catch (e) {
            // // console.log('Foto ya eliminada:', e);
          }
        }
      }
    }
    
    await deleteDoc(galeriaRef);
  } catch (error) {
    // // console.error('Error al eliminar galería:', error);
    throw error;
  }
};

// Subir foto a galería
export const subirFotoGaleria = async (galeriaId, file) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const photoRef = storageRef(storage, `galerias/${galeriaId}/${fileName}`);
    
    await uploadBytes(photoRef, file);
    const url = await getDownloadURL(photoRef);
    
    return {
      url,
      nombre: file.name,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    // // console.error('Error al subir foto:', error);
    throw error;
  }
};

// Agregar foto a galería
export const agregarFotoAGaleria = async (galeriaId, fotoData) => {
  try {
    const galeriaRef = doc(db, 'galerias', galeriaId);
    const galeriaSnap = await getDocs(collection(db, 'galerias'));
    
    let fotoActual = [];
    for (const docSnap of galeriaSnap.docs) {
      if (docSnap.id === galeriaId) {
        fotoActual = docSnap.data().fotos || [];
        break;
      }
    }
    
    fotoActual.push(fotoData);
    
    await updateDoc(galeriaRef, {
      fotos: fotoActual,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    // // console.error('Error al agregar foto:', error);
    throw error;
  }
};

// Eliminar foto de galería
export const eliminarFotoDeGaleria = async (galeriaId, fotoUrl) => {
  try {
    // Eliminar de storage
    const photoRef = storageRef(storage, fotoUrl);
    await deleteObject(photoRef);
    
    // Actualizar documento
    const galeriaRef = doc(db, 'galerias', galeriaId);
    const galeriaSnap = await getDocs(collection(db, 'galerias'));
    
    for (const docSnap of galeriaSnap.docs) {
      if (docSnap.id === galeriaId) {
        const fotos = docSnap.data().fotos || [];
        const fotosFiltradas = fotos.filter(f => f.url !== fotoUrl);
        
        await updateDoc(galeriaRef, {
          fotos: fotosFiltradas,
          updatedAt: serverTimestamp()
        });
        break;
      }
    }
  } catch (error) {
    // // console.error('Error al eliminar foto:', error);
    throw error;
  }
};
