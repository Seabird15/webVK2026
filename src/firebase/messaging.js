import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "./config"; // Importar auth
import { jugadoraAuthUser } from "./jugadorasAuth"; // Importar jugadoraAuthUser
import { guardarTokenNotificacion } from "./notificaciones"; // Importar la nueva función

const messaging = getMessaging();
const functions = getFunctions();

// Prepara la llamada a nuestra Cloud Function
const subscribeToTopicFunction = httpsCallable(functions, 'subscribeToTopic');

/**
 * Solicita permiso para notificaciones y suscribe al usuario a un tema
 * llamando a una Cloud Function.
 * @param {string} topicName - El nombre del tema al que suscribirse (ej: 'ascenso').
 */
export const requestPermissionAndSubscribe = async (topicName) => {
  if (!topicName) {
    // // console.error("No se proporcionó un tema (topic) para la suscripción.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {

      // Obtener el token del dispositivo
      let currentToken = null;
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        // // console.warn("Falta VITE_FIREBASE_VAPID_KEY en las variables de entorno. Añádela a tu .env.local");
      }

      // Si el navegador soporta service workers, intenta registrar/usar el registration
      if (navigator?.serviceWorker) {
        try {
          // Intentar obtener una registration existente para nuestro SW
          let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          if (!registration) {
            try {
              registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            } catch (regErr) {
              // // console.warn('Falló el registro del service worker:', regErr);
            }
          } else {
          }

          // Esperar a que haya una registration activa
          try {
            const readyReg = await navigator.serviceWorker.ready;
            try {
              currentToken = await getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: readyReg,
              });
            } catch (getErr) {
              // // console.warn('getToken con serviceWorkerRegistration falló:', getErr);
            }
          } catch (swErr) {
            // // console.warn('No se pudo esperar por navigator.serviceWorker.ready:', swErr);
          }
        } catch (err) {
          // // console.warn('Error al gestionar service worker:', err);
        }
      }

      // Fallback: intentar sin pasar serviceWorkerRegistration
      if (!currentToken) {
        try {
          currentToken = await getToken(messaging, { vapidKey });
        } catch (fallbackErr) {
          // // console.error('Error en getToken fallback:', fallbackErr);
        }
      }

      if (currentToken) {

        // Guardar el token en Firestore si hay un usuario autenticado (admin o jugadora)
        let userUid = null;
        if (auth.currentUser) {
          userUid = auth.currentUser.uid;
        } else if (jugadoraAuthUser.value) {
          userUid = jugadoraAuthUser.value.uid;
        }
        
        if (userUid) {
          try {
            await guardarTokenNotificacion(userUid, currentToken);
          } catch (saveError) {
            // // console.error('✗ ERROR al guardar token en Firestore:', saveError);
            // // console.error('Error code:', saveError?.code);
            // // console.error('Error message:', saveError?.message);
          }
        } else {
          // // console.warn('No hay usuario autenticado. Token no guardado en Firestore.');
        }

        // Llamar a la Cloud Function para suscribir el token
        try {
          const payload = { token: currentToken, topic: topicName };
          const fnRes = await subscribeToTopicFunction(payload);
        } catch (fnErr) {
          // // console.error('Error al llamar a subscribeToTopic:', fnErr);
          try {
            // // console.error('fnErr.code:', fnErr?.code, 'fnErr.message:', fnErr?.message, 'fnErr.details:', fnErr?.details);
          } catch (e) {
            // ignore
          }
        }

      } else {
      }
    } else {
    }
  } catch (err) {
    // // console.error("Ocurrió un error durante el proceso de suscripción.", err);
  }
};

// Escuchar mensajes mientras la app está en primer plano
onMessage(messaging, (payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/img/icons/android-chrome-192x192.png'
  };
  new Notification(notificationTitle, notificationOptions);
});