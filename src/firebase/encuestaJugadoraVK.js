import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, default as app } from './config';
import { authUser } from './auth';

const functions = getFunctions(app);
const gestionarEncuesta = httpsCallable(functions, 'manageVkAwardSurvey');

const solicitar = async (accion, datos = {}) => {
  const usuarioActual = authUser.value || auth.currentUser;
  const idToken = await usuarioActual?.getIdToken();
  if (!idToken) throw new Error('No hay una sesión activa. Vuelve a iniciar sesión.');

  const respuesta = await gestionarEncuesta({ accion, ...datos, idToken });
  return respuesta.data;
};

export const obtenerEstadoEncuestaVK = () => solicitar('estado');
export const votarJugadoraVK = (candidataId) => solicitar('votar', { candidataId });
export const finalizarEncuestaVK = () => solicitar('finalizar');