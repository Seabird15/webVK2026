import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, setDoc } from 'firebase/firestore';
import app from './config';
import { db } from './config';

const functions = getFunctions(app);

/**
 * Llama a una función de Firebase Cloud para enviar una notificación push.
 *
 * @param {string} topic - El ID del entrenamiento para el que se envía la notificación.
 * @param {string} title - El título de la notificación.
 * @param {string} body - El cuerpo (mensaje) de la notificación.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la notificación ha sido enviada.
 */
export const sendPushNotification = async (topic, title, body) => {
  try {
    const callSendNotification = httpsCallable(functions, 'sendPushNotification');
    
    await callSendNotification({ topic, title, body });
    
    // // console.log('Notificación enviada con éxito.');
  } catch (error) {
    // // console.error('Error al enviar la notificación:', error);
    throw new Error('Hubo un problema al enviar la notificación.');
  }
};

/**
 * Guarda o actualiza el token de notificación de una jugadora en Firestore.
 * @param {string} uid - El UID de la jugadora.
 * @param {string} token - El token de FCM.
 */
export const guardarTokenNotificacion = async (uid, token) => {
  if (!uid || !token) {
    // // console.error("UID o token de notificación no proporcionado.", { uid, token: token ? 'exists' : 'missing' });
    return;
  }

  try {
    // // console.log('Intentando guardar token en Firestore...', { uid, tokenPreview: token.substring(0, 20) + '...' });
    const notificacionRef = doc(db, 'notificaciones', uid);
    await setDoc(notificacionRef, { 
      token: token,
      updatedAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    }, { merge: true });
    // // console.log('✓ Token de notificación guardado exitosamente en Firestore para el UID:', uid);
  } catch (error) {
    // // console.error("✗ Error al guardar el token de notificación:", error);
    throw error; // Re-lanzar el error para que el llamador lo sepa
  }
};
