import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validar que todas las variables estén configuradas
const requiredVars = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingVars = requiredVars.filter(key => !firebaseConfig[key]);

if (missingVars.length > 0) {
  console.warn('⚠️ Faltan variables de entorno de Firebase configuradas:', missingVars);
  console.warn('Por favor, actualiza el archivo .env con tus credenciales de Firebase');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);

// Persistencia local: mantiene la sesión aunque se cierre/recargue el navegador.
// Si el navegador bloquea storage (p.ej. incógnito/ITP), Firebase puede caer a otro modo.
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('No se pudo establecer persistencia local de Auth:', err?.code || err?.message || err);
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
