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
    console.log('Obteniendo rol para UID:', uid);
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const role = userDoc.data().rol;
      console.log('Rol obtenido:', role);
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
  console.log('onAuthStateChanged fired. Usuario:', user?.email || 'No autenticado');
  if (user) {
    authUser.value = user;
    console.log('Usuario establecido en ref:', user.email);
    // Obtener rol del usuario
    await fetchUserRole(user.uid);
  } else {
    console.log('Limpiando autenticación');
    authUser.value = null;
    userRole.value = null;
  }
  // Marcar que Auth está listo DESPUÉS de obtener los datos
  authReady.value = true;
  console.log('authReady establecido a true. userRole:', userRole.value);
});

// Login
export const login = async (email, password) => {
  isLoading.value = true;
  error.value = null;
  try {
    console.log('Iniciando sesión con:', email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    console.log('Usuario autenticado en Firebase:', uid);
    
    // El onAuthStateChanged se disparará automáticamente y obtendrá el rol
    return true;
  } catch (err) {
    console.error('Error en login:', err);
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
    console.log('Cerrando sesión');
    await signOut(auth);
    console.log('Sesión cerrada. userRole limpiado');
    // authUser se limpiará automáticamente en onAuthStateChanged
  } catch (err) {
    console.error('Error en logout:', err);
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
