import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "./config";

const messaging = getMessaging(app);
const functions = getFunctions(app);

// Prepara la llamada a nuestra Cloud Function
const subscribeToTopicFunction = httpsCallable(functions, 'subscribeToTopic');

/**
 * Solicita permiso para notificaciones y suscribe al usuario a un tema
 * llamando a una Cloud Function.
 * @param {string} topicName - El nombre del tema al que suscribirse (ej: 'ascenso').
 */
export const requestPermissionAndSubscribe = async (topicName) => {
  if (!topicName) {
    console.error("No se proporcionó un tema (topic) para la suscripción.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permiso de notificación concedido.");

      // Obtener el token del dispositivo
      let currentToken = null;
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn("Falta VITE_FIREBASE_VAPID_KEY en las variables de entorno. Añádela a tu .env.local");
      }

      // Si el navegador soporta service workers, intenta registrar/usar el registration
      if (navigator?.serviceWorker) {
        console.log('navigator.serviceWorker presente. controller:', navigator.serviceWorker.controller);
        try {
          // Intentar obtener una registration existente para nuestro SW
          let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          if (!registration) {
            console.log('No hay registration para /firebase-messaging-sw.js — registrando ahora...');
            try {
              registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
              console.log('Registro del service worker completado:', registration && registration.scope);
            } catch (regErr) {
              console.warn('Falló el registro del service worker:', regErr);
            }
          } else {
            console.log('Encontrada registration existente:', registration && registration.scope);
          }

          // Esperar a que haya una registration activa
          try {
            const readyReg = await navigator.serviceWorker.ready;
            console.log('navigator.serviceWorker.ready -> scope:', readyReg && readyReg.scope);
            try {
              currentToken = await getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: readyReg,
              });
              console.log('getToken con serviceWorkerRegistration resultó en:', currentToken);
            } catch (getErr) {
              console.warn('getToken con serviceWorkerRegistration falló:', getErr);
            }
          } catch (swErr) {
            console.warn('No se pudo esperar por navigator.serviceWorker.ready:', swErr);
          }
        } catch (err) {
          console.warn('Error al gestionar service worker:', err);
        }
      }

      // Fallback: intentar sin pasar serviceWorkerRegistration
      if (!currentToken) {
        try {
          currentToken = await getToken(messaging, { vapidKey });
          console.log('getToken fallback resultó en:', currentToken);
        } catch (fallbackErr) {
          console.error('Error en getToken fallback:', fallbackErr);
        }
      }

      if (currentToken) {
        console.log("Token de FCM obtenido:", currentToken);

        // Llamar a la Cloud Function para suscribir el token
        console.log(`Llamando a la Cloud Function para suscribir al tema: ${topicName}`);
        try {
          const payload = { token: currentToken, topic: topicName };
          console.log('Payload subscribeToTopic:', payload);
          const fnRes = await subscribeToTopicFunction(payload);
          console.log(`Respuesta de subscribeToTopic:`, fnRes.data || fnRes);
          console.log(`Suscripción al tema '${topicName}' solicitada con éxito.`);
        } catch (fnErr) {
          console.error('Error al llamar a subscribeToTopic:', fnErr);
          try {
            console.error('fnErr.code:', fnErr?.code, 'fnErr.message:', fnErr?.message, 'fnErr.details:', fnErr?.details);
          } catch (e) {
            // ignore
          }
        }

      } else {
        console.log("No se pudo obtener el token. Pide al usuario que habilite las notificaciones.");
      }
    } else {
      console.log("El usuario no concedió permiso para las notificaciones.");
    }
  } catch (err) {
    console.error("Ocurrió un error durante el proceso de suscripción.", err);
  }
};

// Escuchar mensajes mientras la app está en primer plano
onMessage(messaging, (payload) => {
  console.log("Mensaje recibido en primer plano: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/img/icons/android-chrome-192x192.png'
  };
  new Notification(notificationTitle, notificationOptions);
});