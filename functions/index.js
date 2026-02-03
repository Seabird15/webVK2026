const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Cloud Function para SUSCRIBIR un token de dispositivo a un tema (topic).
 */
exports.subscribeToTopic = functions.https.onCall(async (data, context) => {
  // Debug: log incoming data for troubleshooting
  try {
    functions.logger.info('subscribeToTopic incoming data', data);
  } catch (e) {
    functions.logger.warn('subscribeToTopic failed to log data', e);
  }

  // Be defensive: some clients may nest payload under data
  const token = (typeof data?.token === 'string' && data.token) || (typeof data?.data?.token === 'string' && data.data.token);
  const topic = (typeof data?.topic === 'string' && data.topic) || (typeof data?.data?.topic === 'string' && data.data.topic);

  if (!token || !topic) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "La función debe ser llamada con 'token' y 'topic'."
    );
  }

  try {
    // Usa el SDK de Admin para suscribir el token al tema.
    await admin.messaging().subscribeToTopic(token, topic);
    functions.logger.info('subscribeToTopic success', { token, topic });
    return { success: true, message: `Suscrito a ${topic}` };
  } catch (error) {
    functions.logger.error('subscribeToTopic error', { topic, error });
    throw new functions.https.HttpsError(
      "internal",
      "No se pudo completar la suscripción.",
      error
    );
  }
});


/**
 * Cloud Function para ENVIAR notificaciones push a un tema (topic).
 */
exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  // Log incoming data for troubleshooting
  try {
    functions.logger.info('sendPushNotification incoming data', data);
  } catch (e) {
    functions.logger.warn('sendPushNotification failed to log data', e);
  }

  // Be defensive: accept both flat and nested payloads
  const topic = (typeof data?.topic === 'string' && data.topic) || (typeof data?.data?.topic === 'string' && data.data.topic);
  const title = (typeof data?.title === 'string' && data.title) || (typeof data?.data?.title === 'string' && data.data.title);
  const body = (typeof data?.body === 'string' && data.body) || (typeof data?.data?.body === 'string' && data.data.body);

  if (!topic || !title || !body) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "La función debe ser llamada con 'topic', 'title' y 'body'."
    );
  }

  // Build FCM v1 webpush message
  const message = {
    topic,
    webpush: {
      notification: {
        title: title,
        body: body,
      },
      fcmOptions: {
        link: `https://www.clubdeportivovikingas/entrenamientos`,
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    functions.logger.info('sendPushNotification success', { topic, title, body, response });
    return { success: true, messageId: response };
  } catch (error) {
    functions.logger.error('sendPushNotification error', { topic, error });
    throw new functions.https.HttpsError(
      "unknown",
      "No se pudo enviar la notificación.",
      error
    );
  }
});