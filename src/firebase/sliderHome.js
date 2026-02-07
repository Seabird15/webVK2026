import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';

// Obtener todas las imágenes del slider
export const obtenerSliderHome = async () => {
  try {
    const q = query(collection(db, 'sliderHome'), orderBy('orden', 'asc'));
    const querySnapshot = await getDocs(q);
    const imagenes = [];
    querySnapshot.forEach((doc) => {
      imagenes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return imagenes;
  } catch (error) {
    // // console.error('Error al obtener slider:', error);
    throw error;
  }
};

// Subir imagen al slider
export const subirImagenSlider = async (archivo, orden) => {
  try {
    // Crear referencia con nombre único
    const timestamp = Date.now();
    const nombreArchivo = `slider/${timestamp}_${archivo.name}`;
    const fileRef = storageRef(storage, nombreArchivo);

    // Subir archivo
    await uploadBytes(fileRef, archivo);
    
    // Obtener URL de descarga
    const urlDescarga = await getDownloadURL(fileRef);

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, 'sliderHome'), {
      url: urlDescarga,
      orden: orden,
      nombreArchivo: nombreArchivo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      url: urlDescarga,
      orden: orden,
      nombreArchivo: nombreArchivo
    };
  } catch (error) {
    // // console.error('Error al subir imagen:', error);
    throw error;
  }
};

// Actualizar orden de imágenes
export const actualizarOrdenSlider = async (imagenes) => {
  try {
    for (let i = 0; i < imagenes.length; i++) {
      const docRef = doc(db, 'sliderHome', imagenes[i].id);
      await updateDoc(docRef, {
        orden: i,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    // // console.error('Error al actualizar orden:', error);
    throw error;
  }
};

// Eliminar imagen del slider
export const eliminarImagenSlider = async (imagenId, nombreArchivo) => {
  try {
    // Eliminar de Storage
    const fileRef = storageRef(storage, nombreArchivo);
    await deleteObject(fileRef);

    // Eliminar de Firestore
    await deleteDoc(doc(db, 'sliderHome', imagenId));
  } catch (error) {
    // // console.error('Error al eliminar imagen:', error);
    throw error;
  }
};
