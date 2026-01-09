import { ref } from 'vue';
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

// Obtener rol del usuario desde Firestore
const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const role = userDoc.data().rol;
      console.log('Rol obtenido de Firestore:', role, 'UID:', uid);
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
  authUser.value = user;
  if (user) {
    await fetchUserRole(user.uid);
  } else {
    userRole.value = null;
  }
});

// Login
export const login = async (email, password) => {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    console.log('Usuario autenticado. UID:', uid);
    
    // Obtener rol del usuario
    const role = await fetchUserRole(uid);
    console.log('Rol después de fetchUserRole:', role);
    
    // Verificar si el usuario tiene rol admin o coach
    if (role !== 'admin' && role !== 'coach') {
      console.warn('Usuario no tiene rol válido. Rol:', role);
      await signOut(auth);
      error.value = 'No tienes permisos para acceder al panel de administración';
      authUser.value = null;
      userRole.value = null;
      return false;
    }
    
    console.log('Login exitoso. Rol:', role);
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
    await signOut(auth);
    userRole.value = null;
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
