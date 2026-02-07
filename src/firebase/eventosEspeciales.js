import { db, storage } from './config.js';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const EVENTOS_ESPECIALES_DOC = 'config_eventos';
const EVENTOS_ESPECIALES_COLLECTION = 'settings';

/**
 * Obtener próximo y último partido
 */
export const obtenerEventosEspeciales = async () => {
    try {
        const docRef = doc(db, EVENTOS_ESPECIALES_COLLECTION, EVENTOS_ESPECIALES_DOC);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }

        // Si no existe, retornar estructura vacía
        return {
            proximoPartido: null,
            ultimoPartido: null
        };
    } catch (error) {
        // // console.error('Error obteniendo eventos especiales:', error);
        throw error;
    }
};

/**
 * Actualizar próximo partido
 */
export const actualizarProximoPartido = async (datos) => {
    try {
        const docRef = doc(db, EVENTOS_ESPECIALES_COLLECTION, EVENTOS_ESPECIALES_DOC);
        await updateDoc(docRef, {
            proximoPartido: datos,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        // // console.error('Error actualizando próximo partido:', error);
        throw error;
    }
};

/**
 * Actualizar último partido
 */
export const actualizarUltimoPartido = async (datos) => {
    try {
        const docRef = doc(db, EVENTOS_ESPECIALES_COLLECTION, EVENTOS_ESPECIALES_DOC);
        await updateDoc(docRef, {
            ultimoPartido: datos,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        // // console.error('Error actualizando último partido:', error);
        throw error;
    }
};

/**
 * Subir logo de equipo a Cloud Storage
 */
export const subirLogoEquipo = async (file, equipoNombre) => {
    try {
        const timestamp = Date.now();
        const filename = `${timestamp}_${equipoNombre.replace(/\s+/g, '_')}`;
        const fileRef = storageRef(storage, `eventos_especiales/logos/${filename}`);
        
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        
        return url;
    } catch (error) {
        // // console.error('Error subiendo logo:', error);
        throw error;
    }
};

/**
 * Inicializar documento si no existe
 */
export const inicializarEventosEspeciales = async () => {
    try {
        const docRef = doc(db, EVENTOS_ESPECIALES_COLLECTION, EVENTOS_ESPECIALES_DOC);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                proximoPartido: null,
                ultimoPartido: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        // // console.error('Error inicializando eventos especiales:', error);
        throw error;
    }
};
