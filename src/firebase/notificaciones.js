import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, setDoc } from 'firebase/firestore';
import app from './config';
import { auth, db } from './config';
import { authReady, authUser } from './auth';

const functions = getFunctions(app);

const esperarAuthAdmin = async (timeoutMs = 5000) => {
  const inicio = Date.now();

  while (!authReady.value && (Date.now() - inicio) < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

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
    
  } catch (error) {
    // // console.error('Error al enviar la notificación:', error);
    throw new Error('Hubo un problema al enviar la notificación.');
  }
};

export const resendTrainingEmailReminder = async (entrenamientoId) => {
  try {
    await esperarAuthAdmin();

    const usuario = auth.currentUser || authUser.value;

    if (!usuario) {
      throw new Error('Debes iniciar sesión para reenviar el correo recordatorio.');
    }

    const idToken = await usuario.getIdToken(true);
    const endpoint = `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/resendTrainingEmailReminder`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({ entrenamientoId })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error || payload?.message || 'No se pudo reenviar el correo recordatorio.');
    }

    return payload;
  } catch (error) {
    throw new Error(error?.message || 'Hubo un problema al reenviar el correo recordatorio.');
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
    const notificacionRef = doc(db, 'notificaciones', uid);
    await setDoc(notificacionRef, { 
      token: token,
      updatedAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    }, { merge: true });
  } catch (error) {
    // // console.error("✗ Error al guardar el token de notificación:", error);
    throw error; // Re-lanzar el error para que el llamador lo sepa
  }
};
