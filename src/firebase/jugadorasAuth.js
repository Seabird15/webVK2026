import { ref } from 'vue';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, db, storage } from './config';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const jugadoraAuthUser = ref(null);
export const jugadoraData = ref(null);
export const isLoadingJugadora = ref(false);
export const errorJugadora = ref(null);
export const authReady = ref(false); // Flag para saber cuando Auth está listo

const normalizarCategoriaEquipo = (valor) => {
  const normalizado = (valor || '').toString().trim().toLowerCase();
  return ['ascenso', 'escuela', 'ambos'].includes(normalizado) ? normalizado : '';
};

const resolverCategoriaSeleccionada = (equipo, categoriaSolicitada, categoriaActual = '') => {
  const equipoNormalizado = normalizarCategoriaEquipo(equipo);
  const categoriaSolicitadaNormalizada = normalizarCategoriaEquipo(categoriaSolicitada);
  const categoriaActualNormalizada = normalizarCategoriaEquipo(categoriaActual);

  if (equipoNormalizado === 'ascenso' || equipoNormalizado === 'escuela') {
    return equipoNormalizado;
  }

  if (equipoNormalizado === 'ambos') {
    if (categoriaSolicitadaNormalizada === 'ascenso' || categoriaSolicitadaNormalizada === 'escuela' || categoriaSolicitadaNormalizada === 'ambos') {
      return categoriaSolicitadaNormalizada;
    }

    if (categoriaActualNormalizada === 'ascenso' || categoriaActualNormalizada === 'escuela' || categoriaActualNormalizada === 'ambos') {
      return categoriaActualNormalizada;
    }

    return 'ascenso';
  }

  return categoriaSolicitadaNormalizada || categoriaActualNormalizada || 'ascenso';
};

// Flag para ignorar el primer onAuthStateChanged después del registro
let ignorarProximoAuthChange = false;

// Observar cambios de autenticación para jugadoras
onAuthStateChanged(auth, async (user) => {
  // // console.log('onAuthStateChanged disparado, usuario:', user?.uid, 'ignorar:', ignorarProximoAuthChange);
  
  // Si debemos ignorar este cambio, solo marcamos el flag como falso
  if (ignorarProximoAuthChange) {
    // // console.log('Ignorando onAuthStateChanged temporalmente');
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
      // // console.log('Datos de jugadora cargados:', jugadoraData.value);
    } else {
      // Si no existe, crear estado vacío (perfil no completado aún)
      jugadoraData.value = {
        id: user.uid,
        perfilCompleto: false
      };
      // // console.log('Documento de jugadora no existe aún, perfil incompleto');
    }
  } else {
    jugadoraData.value = null;
    // // console.log('Usuario desconectado');
  }
  
  // Marcar que Auth está listo
  authReady.value = true;
});

// Login de jugadora
export const loginJugadora = async (email, password) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    // // console.log('Jugadora autenticada. UID:', uid);
    
    // Cargar datos de la jugadora
    await fetchJugadoraData(uid);
    
    return true;
  } catch (err) {
    // // console.error('Error en login de jugadora:', err);
    if (err.code === 'auth/user-not-found') {
      errorJugadora.value = 'Usuario no encontrado';
    } else if (err.code === 'auth/wrong-password') {
      errorJugadora.value = 'Contraseña incorrecta';
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

// Obtener datos de la jugadora desde Firestore
export const fetchJugadoraData = async (uid, coleccion = 'jugadoraRegistro') => {
  try {
    const jugadoraDoc = await getDoc(doc(db, coleccion, uid));
    if (jugadoraDoc.exists()) {
      jugadoraData.value = {
        id: uid,
        ...jugadoraDoc.data()
      };
      // // console.log('Datos de jugadora cargados desde', coleccion, ':', jugadoraData.value);
      return jugadoraData.value;
    } else {
      // // console.warn('Documento de jugadora no existe en', coleccion, 'para uid:', uid);
      jugadoraData.value = null;
      return null;
    }
  } catch (err) {
    // // console.error('Error obteniendo datos de jugadora:', err);
    jugadoraData.value = null;
    return null;
  }
};

export const actualizarCategoriaSeleccionadaJugadora = async (uid, categoria) => {
  try {
    if (!uid) return false;

    const jugadoraRef = doc(db, 'jugadoraRegistro', uid);
    const jugadoraSnap = await getDoc(jugadoraRef);

    if (!jugadoraSnap.exists()) {
      return false;
    }

    const jugadoraDoc = jugadoraSnap.data() || {};
    const categoriaSeleccionada = resolverCategoriaSeleccionada(
      jugadoraDoc.equipo,
      categoria,
      jugadoraDoc.categoriaSeleccionada
    );

    await updateDoc(jugadoraRef, {
      categoriaSeleccionada,
      updatedAt: new Date()
    });

    if (jugadoraData.value?.id === uid) {
      jugadoraData.value = {
        ...jugadoraData.value,
        categoriaSeleccionada,
        updatedAt: new Date()
      };
    }

    return true;
  } catch (err) {
    errorJugadora.value = err.message;
    return false;
  }
};

// Obtener todas las jugadoras registradas por equipo
export const fetchJugadorasRegistradasPorEquipo = async (equipo) => {
  try {
    let q;
    if (equipo === 'ambos') {
      // Si el equipo es "ambos", traer todas las jugadoras
      q = collection(db, 'jugadoraRegistro');
    } else {
      // Filtrar por equipo específico O jugadoras que juegan en ambos equipos
      q = query(
        collection(db, 'jugadoraRegistro'),
        where('equipo', 'in', [equipo, 'ambos'])
      );
    }
    
    const snapshot = await getDocs(q);
    const jugadoras = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    
    // // console.log(`Jugadoras registradas del equipo ${equipo}:`, jugadoras.length, jugadoras);
    return jugadoras;
  } catch (err) {
    // // console.error('Error obteniendo jugadoras registradas:', err);
    return [];
  }
};

// Obtener jugadoras por equipo y posición desde jugadoraRegistro
export const obtenerJugadorasPorPosicionRegistro = async (equipo, posicion) => {
  try {
    let q;
    if (equipo === 'ambos') {
      // Solo filtrar por posición
      q = query(
        collection(db, 'jugadoraRegistro'),
        where('posicion', '==', posicion)
      );
    } else {
      // Filtrar por equipo (específico o ambos) y posición
      q = query(
        collection(db, 'jugadoraRegistro'),
        where('equipo', 'in', [equipo, 'ambos']),
        where('posicion', '==', posicion)
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      foto: doc.data().fotoPerfil || null, // Mapear fotoPerfil a foto
      numero: doc.data().dorsal || null // Mapear dorsal a numero
    }));
  } catch (err) {
    // // console.error(`Error obteniendo ${posicion}:`, err);
    return [];
  }
};

// Obtener toda la estructura de un equipo desde jugadoraRegistro
export const obtenerEquipoCompletoRegistro = async (equipo) => {
  try {
    const [dt, pa, porteras, defensas, alas, medio, delanteras] = await Promise.all([
      obtenerJugadorasPorPosicionRegistro(equipo, 'Directora Técnica'),
      obtenerJugadorasPorPosicionRegistro(equipo, 'Preparador Porteras'),
      obtenerJugadorasPorPosicionRegistro(equipo, 'Portera'),
      obtenerJugadorasPorPosicionRegistro(equipo, 'Cierre'),
      obtenerJugadorasPorPosicionRegistro(equipo, 'Ala'),
      obtenerJugadorasPorPosicionRegistro(equipo, 'Medio'),
      obtenerJugadorasPorPosicionRegistro(equipo, 'Pívot')
    ]);

    return {
      directoraTecnica: dt[0] || null,
      preparadorPorteras: pa[0] || null,
      porteras: porteras,
      defensas: defensas,
      alas: alas,
      medio: medio,
      delanteras: delanteras
    };
  } catch (err) {
    // // console.error('Error obteniendo equipo completo:', err);
    return {
      directoraTecnica: null,
      preparadorPorteras: null,
      porteras: [],
      defensas: [],
      alas: [],
      medio: [],
      delanteras: []
    };
  }
};

// Registrar solicitud de acceso
export const solicitarAcceso = async (email, password) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    // // console.log('Creando solicitud de acceso para:', email);
    
    // Marcar que ignoremos el próximo onAuthStateChanged
    ignorarProximoAuthChange = true;
    // // console.log('Flag ignorarProximoAuthChange activado');
    
    // Crear usuario en Auth
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    // // console.log('Usuario creado en Auth con uid:', uid);

    // Crear documento en jugadorasLogin
    await setDoc(doc(db, 'jugadorasLogin', uid), {
      email: email,
      estado: 'pendiente',
      uid: uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // // console.log('Documento en jugadorasLogin creado');

    // Crear documento inicial en jugadoras con estado pendiente
    await setDoc(doc(db, 'jugadoras', uid), {
      email: email,
      estado: 'pendiente',
      uid: uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // // console.log('Documento en jugadoras creado');

    // Hacer logout automático hasta que sea aprobada
    await signOut(auth);
    // // console.log('Usuario desconectado. Esperando aprobación.');
    
    return true;
  } catch (err) {
    // // console.error('Error solicitando acceso:', err);
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

// Completar perfil de jugadora (después de aprobación)
export const completarPerfilJugadora = async (uid, perfilData, fotoFile) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    // // console.log('Completando perfil para uid:', uid);
    // // console.log('Datos del perfil a guardar:', perfilData);
    
    let fotoUrl = null;

    // Subir foto a Storage si existe
    if (fotoFile) {
      // // console.log('Subiendo foto de perfil...');
      const filename = `jugadoras/${uid}/perfil_${Date.now()}`;
      const fileRef = storageRef(storage, filename);
      await uploadBytes(fileRef, fotoFile);
      fotoUrl = await getDownloadURL(fileRef);
      // // console.log('Foto guardada en Storage:', fotoUrl);
    }

    // Preparar datos a actualizar
    const dataToUpdate = {
      ...perfilData,
      uid: uid,
      categoriaSeleccionada: resolverCategoriaSeleccionada(perfilData?.equipo, perfilData?.categoriaSeleccionada),
      perfilCompleto: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (fotoUrl) {
      dataToUpdate.fotoPerfil = fotoUrl;
    }

    // // console.log('Datos finales a guardar en jugadoraRegistro:', dataToUpdate);

    // Guardar en jugadoraRegistro (colección principal para el perfil)
    await setDoc(doc(db, 'jugadoraRegistro', uid), dataToUpdate);
    // // console.log('Documento en jugadoraRegistro creado correctamente');

    // Actualizar datos locales
    const datosActualizados = await fetchJugadoraData(uid, 'jugadoraRegistro');
    // // console.log('Datos locales actualizados:', datosActualizados);
    
    return true;
  } catch (err) {
    // // console.error('Error completando perfil:', err);
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
      categoriaSeleccionada: resolverCategoriaSeleccionada(
        perfilData?.equipo,
        perfilData?.categoriaSeleccionada,
        jugadoraData.value?.categoriaSeleccionada
      ),
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
    // // console.error('Error actualizando perfil:', err);
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
