// Importar Firebase usando importScripts, el método tradicional para Service Workers
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

// Inicializa Firebase en el Service Worker con la mínima
// información necesaria para FCM (no expone apiKey ni otros campos).
const firebaseConfig = {
  messagingSenderId: "400299482128"
};

// Ahora usa la sintaxis de la versión "compat"
firebase.initializeApp(firebaseConfig);

// Obtener la instancia de Messaging
const messaging = firebase.messaging();


// Manejar mensajes en segundo plano (cuando la página no está en primer plano)
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload?.notification?.title || 'Notificación';

  // Intentar obtener una URL de destino desde diferentes campos posibles del payload
  const clickAction =
    payload?.webpush?.notification?.click_action ||
    payload?.notification?.click_action ||
    payload?.fcmOptions?.link ||
    payload?.data?.click_action ||
    '/';

  const notificationOptions = {
    body: payload?.notification?.body || '',
    icon: '/src/assets/logoVk.png',
    data: { click_action: clickAction }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Abrir la URL correspondiente al hacer clic en la notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification?.data?.click_action || '/';
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      const existing = allClients.find(c => c.url === url);
      if (existing) {
        existing.focus();
      } else {
        await clients.openWindow(url);
      }
    })()
  );
});