import { ref, watch } from 'vue';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, getDoc } from 'firebase/firestore';

export const authUser = ref(null);
export const userRole = ref(null);
export const isLoading = ref(false);
export const error = ref(null);
export const authReady = ref(false);

// Obtener rol del usuario desde Firestore
const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const role = userDoc.data().rol;
      userRole.value = role;
      return role;
    } else {
      console.warn('No existe documento de usuario en Firestore para UID:', uid);
    }
    return null;
  } catch (err) {
    console.error('Error obteniendo rol del usuario:', err);
    return null;
  }
};

// Observar cambios de autenticación
onAuthStateChanged(auth, async (user) => {
  if (user) {
    authUser.value = user;
    // Obtener rol del usuario
    await fetchUserRole(user.uid);
  } else {
    authUser.value = null;
    userRole.value = null;
  }
  // Marcar que Auth está listo DESPUÉS de obtener los datos
  authReady.value = true;
});

// Login
export const login = async (email, password) => {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    
    // El onAuthStateChanged se disparará automáticamente y obtendrá el rol
    return true;
  } catch (err) {
    // Mensajes de error amigables
    if (err.code === 'auth/user-not-found') {
      error.value = 'Usuario no encontrado';
    } else if (err.code === 'auth/wrong-password') {
      error.value = 'Contraseña incorrecta';
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Email inválido';
    } else {
      error.value = err.message;
    }
    return false;
  } finally {
    isLoading.value = false;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    // authUser se limpiará automáticamente en onAuthStateChanged
  } catch (err) {
    error.value = err.message;
  }
};

// Verificar si está autenticado y es admin/coach
export const isAuthenticated = () => {
  return authUser.value !== null && (userRole.value === 'admin' || userRole.value === 'coach');
};

// Verificar si es admin
export const isAdmin = () => {
  return userRole.value === 'admin';
};

// Verificar si es coach
export const isCoach = () => {
  return userRole.value === 'coach';
};
