import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './config';

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
    
    console.log('Notificación enviada con éxito.');
  } catch (error) {
    console.error('Error al enviar la notificación:', error);
    throw new Error('Hubo un problema al enviar la notificación.');
  }
};
