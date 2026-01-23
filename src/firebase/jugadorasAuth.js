import { ref } from 'vue';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db, storage } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const jugadoraAuthUser = ref(null);
export const jugadoraData = ref(null);
export const isLoadingJugadora = ref(false);
export const errorJugadora = ref(null);
export const authReady = ref(false); // Flag para saber cuando Auth está listo

// Flag para ignorar el primer onAuthStateChanged después del registro
let ignorarProximoAuthChange = false;

// Observar cambios de autenticación para jugadoras
onAuthStateChanged(auth, async (user) => {
  console.log('onAuthStateChanged disparado, usuario:', user?.uid, 'ignorar:', ignorarProximoAuthChange);
  
  // Si debemos ignorar este cambio, solo marcamos el flag como falso
  if (ignorarProximoAuthChange) {
    console.log('Ignorando onAuthStateChanged temporalmente');
    ignorarProximoAuthChange = false;
    authReady.value = true; // Marcar que Auth está listo
    return;
  }
  
  jugadoraAuthUser.value = user;
  if (user) {
    // Intentar cargar datos de Firestore
    // Si el documento no existe, es normal (aún no completó perfil)
    const jugadoraRegistroDoc = await getDoc(doc(db, 'jugadoraRegistro', user.uid));
    
    if (jugadoraRegistroDoc.exists()) {
      jugadoraData.value = {
        id: user.uid,
        ...jugadoraRegistroDoc.data()
      };
      console.log('Datos de jugadora cargados:', jugadoraData.value);
    } else {
      // Si no existe, crear estado vacío (perfil no completado aún)
      jugadoraData.value = {
        id: user.uid,
        perfilCompleto: false
      };
      console.log('Documento de jugadora no existe aún, perfil incompleto');
    }
  } else {
    jugadoraData.value = null;
    console.log('Usuario desconectado');
  }
  
  // Marcar que Auth está listo
  authReady.value = true;
});

// Obtener datos de la jugadora desde Firestore
export const fetchJugadoraData = async (uid, coleccion = 'jugadoraRegistro') => {
  try {
    const jugadoraDoc = await getDoc(doc(db, coleccion, uid));
    if (jugadoraDoc.exists()) {
      jugadoraData.value = {
        id: uid,
        ...jugadoraDoc.data()
      };
      console.log('Datos de jugadora cargados desde', coleccion, ':', jugadoraData.value);
      return jugadoraData.value;
    } else {
      console.warn('Documento de jugadora no existe en', coleccion, 'para uid:', uid);
      jugadoraData.value = null;
      return null;
    }
  } catch (err) {
    console.error('Error obteniendo datos de jugadora:', err);
    jugadoraData.value = null;
    return null;
  }
};

// Registrar solicitud de acceso
export const solicitarAcceso = async (email, password) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    console.log('Creando solicitud de acceso para:', email);
    
    // Marcar que ignoremos el próximo onAuthStateChanged
    ignorarProximoAuthChange = true;
    console.log('Flag ignorarProximoAuthChange activado');
    
    // Crear usuario en Auth
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    console.log('Usuario creado en Auth con uid:', uid);

    // Crear documento en jugadorasLogin
    await setDoc(doc(db, 'jugadorasLogin', uid), {
      email: email,
      estado: 'pendiente',
      uid: uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Documento en jugadorasLogin creado');

    // Crear documento inicial en jugadoras con estado pendiente
    await setDoc(doc(db, 'jugadoras', uid), {
      email: email,
      estado: 'pendiente',
      uid: uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Documento en jugadoras creado');

    // Hacer logout automático hasta que sea aprobada
    await signOut(auth);
    console.log('Usuario desconectado. Esperando aprobación.');
    
    return true;
  } catch (err) {
    console.error('Error solicitando acceso:', err);
    if (err.code === 'auth/email-already-in-use') {
      errorJugadora.value = 'Este email ya está registrado';
    } else if (err.code === 'auth/weak-password') {
      errorJugadora.value = 'La contraseña debe tener al menos 6 caracteres';
    } else if (err.code === 'auth/invalid-email') {
      errorJugadora.value = 'Email inválido';
    } else {
      errorJugadora.value = err.message;
    }
    return false;
  } finally {
    isLoadingJugadora.value = false;
  }
};

// Login para jugadoras
export const loginJugadora = async (email, password) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    console.log('Intentando login con:', email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    console.log('Usuario autenticado en Auth:', uid);

    // Verificar si está aprobada en Firestore (en jugadorasLogin)
    const jugadorasLoginDoc = await getDoc(doc(db, 'jugadorasLogin', uid));
    if (!jugadorasLoginDoc.exists()) {
      console.error('Documento de jugadora no existe en jugadorasLogin');
      await signOut(auth);
      errorJugadora.value = 'Solicitud de acceso no encontrada';
      return false;
    }

    const loginData = jugadorasLoginDoc.data();
    console.log('Estado en jugadorasLogin:', loginData.estado);
    
    if (loginData.estado !== 'aprobada') {
      console.log('Usuario no aprobado, estado:', loginData.estado);
      await signOut(auth);
      errorJugadora.value = loginData.estado === 'rechazada' 
        ? 'Tu solicitud fue rechazada' 
        : 'Tu solicitud aún está pendiente de aprobación';
      return false;
    }

    // Intentar cargar datos del perfil completo desde jugadoraRegistro
    // Si no existe, significa que aún no completó el perfil (es normal)
    const jugadoraRegistroDoc = await getDoc(doc(db, 'jugadoraRegistro', uid));
    
    if (jugadoraRegistroDoc.exists()) {
      // Si existe el perfil, cargarlo
      jugadoraData.value = {
        id: uid,
        ...jugadoraRegistroDoc.data()
      };
      console.log('Datos del perfil cargados desde jugadoraRegistro:', jugadoraData.value);
    } else {
      // Si no existe aún, crear un documento vacío (será completado después)
      jugadoraData.value = {
        id: uid,
        email: email,
        perfilCompleto: false
      };
      console.log('Perfil aún no completado. Usuario puede completarlo en /completar-perfil');
    }
    
    return true;
  } catch (err) {
    console.error('Error en login jugadora:', err);
    if (err.code === 'auth/user-not-found') {
      errorJugadora.value = 'Usuario no encontrado';
    } else if (err.code === 'auth/wrong-password') {
      errorJugadora.value = 'Contraseña incorrecta';
    } else if (err.code === 'auth/invalid-credential') {
      errorJugadora.value = 'Email o contraseña incorrectos';
    } else if (err.code === 'auth/invalid-email') {
      errorJugadora.value = 'Email inválido';
    } else {
      errorJugadora.value = err.message || 'Error al iniciar sesión';
    }
    return false;
  } finally {
    isLoadingJugadora.value = false;
  }
};

// Completar perfil de jugadora (después de aprobación)
export const completarPerfilJugadora = async (uid, perfilData, fotoFile) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    console.log('Completando perfil para uid:', uid);
    console.log('Datos del perfil a guardar:', perfilData);
    
    let fotoUrl = null;

    // Subir foto a Storage si existe
    if (fotoFile) {
      console.log('Subiendo foto de perfil...');
      const filename = `jugadoras/${uid}/perfil_${Date.now()}`;
      const fileRef = storageRef(storage, filename);
      await uploadBytes(fileRef, fotoFile);
      fotoUrl = await getDownloadURL(fileRef);
      console.log('Foto guardada en Storage:', fotoUrl);
    }

    // Preparar datos a actualizar
    const dataToUpdate = {
      ...perfilData,
      uid: uid,
      perfilCompleto: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (fotoUrl) {
      dataToUpdate.fotoPerfil = fotoUrl;
    }

    console.log('Datos finales a guardar en jugadoraRegistro:', dataToUpdate);

    // Guardar en jugadoraRegistro (colección principal para el perfil)
    await setDoc(doc(db, 'jugadoraRegistro', uid), dataToUpdate);
    console.log('Documento en jugadoraRegistro creado correctamente');

    // Actualizar datos locales
    const datosActualizados = await fetchJugadoraData(uid, 'jugadoraRegistro');
    console.log('Datos locales actualizados:', datosActualizados);
    
    return true;
  } catch (err) {
    console.error('Error completando perfil:', err);
    errorJugadora.value = err.message;
    return false;
  } finally {
    isLoadingJugadora.value = false;
  }
};

// Actualizar perfil de jugadora
export const actualizarPerfilJugadora = async (uid, perfilData, fotoFile) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    const dataToUpdate = {
      ...perfilData,
      updatedAt: new Date()
    };

    // Subir nueva foto si existe
    if (fotoFile) {
      const filename = `jugadoras/${uid}/perfil_${Date.now()}`;
      const fileRef = storageRef(storage, filename);
      await uploadBytes(fileRef, fotoFile);
      dataToUpdate.fotoPerfil = await getDownloadURL(fileRef);
    }

    // Actualizar en jugadoraRegistro
    await updateDoc(doc(db, 'jugadoraRegistro', uid), dataToUpdate);
    await fetchJugadoraData(uid, 'jugadoraRegistro');
    return true;
  } catch (err) {
    console.error('Error actualizando perfil:', err);
    errorJugadora.value = err.message;
    return false;
  } finally {
    isLoadingJugadora.value = false;
  }
};

// Logout para jugadoras
export const logoutJugadora = async () => {
  try {
    await signOut(auth);
    jugadoraData.value = null;
  } catch (err) {
    errorJugadora.value = err.message;
  }
};

// Verificar si jugadora tiene perfil completo
export const tienePerfılCompleto = () => {
  return jugadoraData.value && jugadoraData.value.perfilCompleto === true;
};

// Obtener equipo de jugadora
export const obtenerEquipoJugadora = () => {
  return jugadoraData.value?.equipo || null;
};
