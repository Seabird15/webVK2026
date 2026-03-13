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
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const jugadoraAuthUser = ref(null);
export const jugadoraData = ref(null);
export const isLoadingJugadora = ref(false);
export const errorJugadora = ref(null);
export const authReady = ref(false); // Flag para saber cuando Auth está listo

const EQUIPOS_VALIDOS = ['ascenso', 'escuela', 'serieC'];

const normalizarCategoriaEquipo = (valor) => {
  if (!valor) return '';
  const normalizado = valor.toString().trim().toLowerCase();
  // Retornar 'serieC' consistente con el resto del código
  if (normalizado === 'seriec' || normalizado === 'serieC') return 'serieC';
  if (normalizado === 'ascenso' || normalizado === 'escuela' || normalizado === 'ambos') return normalizado;
  return '';
};

const normalizarListaEquipos = (equipos = []) => {
  if (!Array.isArray(equipos)) return [];

  const vistos = new Set();

  return equipos
    .map(equipo => normalizarCategoriaEquipo(equipo))
    .filter((equipo) => {
      if (!EQUIPOS_VALIDOS.includes(equipo) || vistos.has(equipo)) {
        return false;
      }

      vistos.add(equipo);
      return true;
    });
};

const resolverEquiposDesdeCampos = (equipo, equipos) => {
  const equiposNormalizados = normalizarListaEquipos(equipos);
  if (equiposNormalizados.length > 0) {
    return equiposNormalizados;
  }

  const equipoNormalizado = normalizarCategoriaEquipo(equipo);
  if (equipoNormalizado === 'ambos') {
    return ['ascenso', 'escuela'];
  }

  if (EQUIPOS_VALIDOS.includes(equipoNormalizado)) {
    return [equipoNormalizado];
  }

  return [];
};

export const obtenerEquiposJugadoraDesdeDatos = (jugadora = null) => {
  return resolverEquiposDesdeCampos(jugadora?.equipo, jugadora?.equipos);
};

export const obtenerEquiposJugadora = () => {
  return obtenerEquiposJugadoraDesdeDatos(jugadoraData.value);
};

// Convertir array de equipos a string para resolverCategoriaSeleccionada
const convertirEquiposAString = (equipos) => {
  const equiposNormalizados = Array.isArray(equipos)
    ? normalizarListaEquipos(equipos)
    : resolverEquiposDesdeCampos(equipos);

  if (equiposNormalizados.length === 0) return '';
  if (equiposNormalizados.length === 2 && equiposNormalizados.includes('ascenso') && equiposNormalizados.includes('escuela')) {
    return 'ambos';
  }

  return equiposNormalizados[0];
};

const normalizarDatosJugadora = (uid, data = {}) => {
  const equipos = obtenerEquiposJugadoraDesdeDatos(data);
  const equipo = convertirEquiposAString(equipos);

  return {
    id: uid,
    ...data,
    ...(equipos.length > 0 ? { equipos, equipo } : {})
  };
};

const resolverCategoriaSeleccionada = (equipo, categoriaSolicitada, categoriaActual = '', equipos = []) => {
  const equiposPermitidos = resolverEquiposDesdeCampos(equipo, equipos);
  const categoriaSolicitadaNormalizada = normalizarCategoriaEquipo(categoriaSolicitada);
  const categoriaActualNormalizada = normalizarCategoriaEquipo(categoriaActual);

  if (equiposPermitidos.length === 1) {
    return equiposPermitidos[0];
  }

  if (equiposPermitidos.length > 1) {
    if (equiposPermitidos.includes(categoriaSolicitadaNormalizada)) {
      return categoriaSolicitadaNormalizada;
    }

    if (equiposPermitidos.includes(categoriaActualNormalizada)) {
      return categoriaActualNormalizada;
    }

    if (categoriaSolicitadaNormalizada === 'ambos' || categoriaActualNormalizada === 'ambos') {
      return 'ambos';
    }

    return equiposPermitidos[0];
  }

  const equipoString = convertirEquiposAString(equipo);
  const equipoNormalizado = normalizarCategoriaEquipo(equipoString);

  if (equipoNormalizado === 'ascenso' || equipoNormalizado === 'escuela' || equipoNormalizado === 'serieC') {
    return equipoNormalizado;
  }

  if (equipoNormalizado === 'ambos') {
    if (categoriaSolicitadaNormalizada === 'ascenso' || categoriaSolicitadaNormalizada === 'escuela' || categoriaSolicitadaNormalizada === 'serieC' || categoriaSolicitadaNormalizada === 'ambos') {
      return categoriaSolicitadaNormalizada;
    }

    if (categoriaActualNormalizada === 'ascenso' || categoriaActualNormalizada === 'escuela' || categoriaActualNormalizada === 'serieC' || categoriaActualNormalizada === 'ambos') {
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
  console.log('🔐 onAuthStateChanged ejecutado - user:', user?.uid);
  
  // Si debemos ignorar este cambio, solo marcamos el flag como falso
  if (ignorarProximoAuthChange) {
    ignorarProximoAuthChange = false;
    authReady.value = true; // Marcar que Auth está listo
    console.log('✅ Ignorando onAuthStateChanged después del registro');
    return;
  }
  
  jugadoraAuthUser.value = user;
  console.log('✅ jugadoraAuthUser actualizado a:', user?.uid);
  
  if (user) {
    // Intentar cargar datos de Firestore
    // Si el documento no existe, es normal (aún no completó perfil)
    const jugadoraRegistroDoc = await getDoc(doc(db, 'jugadoraRegistro', user.uid));
    
    if (jugadoraRegistroDoc.exists()) {
      jugadoraData.value = normalizarDatosJugadora(user.uid, jugadoraRegistroDoc.data());
      console.log('✅ Documento de jugadora cargado desde Firestore');
    } else {
      // Si no existe, crear estado vacío (perfil no completado aún)
      jugadoraData.value = {
        id: user.uid,
        perfilCompleto: false
      };
      console.log('⚠️ Documento de jugadora no existe en Firestore para UID:', user.uid);
    }
  } else {
    jugadoraData.value = null;
    console.log('❌ Usuario desautenticado');
  }
  
  // Marcar que Auth está listo
  authReady.value = true;
  console.log('✅ authReady.value = true');
});

// Login de jugadora
export const loginJugadora = async (email, password) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    
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
      jugadoraData.value = normalizarDatosJugadora(uid, jugadoraDoc.data());
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
      jugadoraDoc.categoriaSeleccionada,
      jugadoraDoc.equipos
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
    
    return jugadoras;
  } catch (err) {
    // // console.error('Error obteniendo jugadoras registradas:', err);
    return [];
  }
};

// Verificar si una jugadora pertenece a un equipo
const pertenecePorEquipo = (jugadora, equipo) => {
  // Soportar formato nuevo: equipos como array
  if (Array.isArray(jugadora.equipos)) {
    return jugadora.equipos.includes(equipo);
  }
  // Soportar formato antiguo: equipo como string
  if (equipo === 'ascenso') {
    return jugadora.equipo === 'ascenso' || jugadora.equipo === 'ambos';
  } else if (equipo === 'escuela') {
    return jugadora.equipo === 'escuela' || jugadora.equipo === 'ambos';
  } else if (equipo === 'serieC') {
    return jugadora.equipo === 'serieC';
  }
  return false;
};

// Obtener jugadoras por equipo y posición desde jugadoraRegistro
export const obtenerJugadorasPorPosicionRegistro = async (equipo, posicion) => {
  try {
    // Obtener todas las jugadoras de esta posición
    const q = query(
      collection(db, 'jugadoraRegistro'),
      where('posicion', '==', posicion)
    );
    
    const snapshot = await getDocs(q);
    const todasLasJugadoras = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      foto: doc.data().fotoPerfil || null,
      numero: doc.data().dorsal || null
    }));

    // Filtrar por equipo en JavaScript para soportar tanto formato antiguo como nuevo
    if (equipo === 'ambos') {
      // Si se solicita 'ambos', devolver todas (para compatibilidad histórica)
      return todasLasJugadoras;
    } else {
      return todasLasJugadoras.filter(j => pertenecePorEquipo(j, equipo));
    }
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
    
    // Marcar que ignoremos el próximo onAuthStateChanged
    ignorarProximoAuthChange = true;
    
    // Crear usuario en Auth
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;

    // Crear documento en jugadorasLogin
    await setDoc(doc(db, 'jugadorasLogin', uid), {
      email: email,
      estado: 'pendiente',
      uid: uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Crear documento inicial en jugadoras con estado pendiente
    await setDoc(doc(db, 'jugadoras', uid), {
      email: email,
      estado: 'pendiente',
      uid: uid,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Hacer logout automático hasta que sea aprobada
    await signOut(auth);
    
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
    
    let fotoUrl = null;

    // Subir foto a Storage si existe
    if (fotoFile) {
      const filename = `jugadoras/${uid}/perfil_${Date.now()}`;
      const fileRef = storageRef(storage, filename);
      await uploadBytes(fileRef, fotoFile);
      fotoUrl = await getDownloadURL(fileRef);
    }

    // Preparar datos a actualizar
    const dataToUpdate = {
      ...perfilData,
      uid: uid,
      equipos: obtenerEquiposJugadoraDesdeDatos(perfilData),
      equipo: convertirEquiposAString(obtenerEquiposJugadoraDesdeDatos(perfilData)),
      categoriaSeleccionada: resolverCategoriaSeleccionada(
        perfilData?.equipo,
        perfilData?.categoriaSeleccionada,
        '',
        obtenerEquiposJugadoraDesdeDatos(perfilData)
      ),
      perfilCompleto: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (fotoUrl) {
      dataToUpdate.fotoPerfil = fotoUrl;
    }

    // Guardar en jugadoraRegistro (colección principal para el perfil)
    await setDoc(doc(db, 'jugadoraRegistro', uid), dataToUpdate);

    // Actualizar datos locales
    const datosActualizados = await fetchJugadoraData(uid, 'jugadoraRegistro');
    
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
    const equiposNormalizados = obtenerEquiposJugadoraDesdeDatos(perfilData);
    const equipoLegacy = convertirEquiposAString(equiposNormalizados);
    const dataToUpdate = {
      ...perfilData,
      equipos: equiposNormalizados,
      equipo: equipoLegacy,
      categoriaSeleccionada: resolverCategoriaSeleccionada(
        equipoLegacy,
        perfilData?.categoriaSeleccionada,
        jugadoraData.value?.categoriaSeleccionada,
        equiposNormalizados
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
  return convertirEquiposAString(obtenerEquiposJugadora());
};

// Eliminar perfil de jugadora
export const eliminarJugadora = async (uid) => {
  isLoadingJugadora.value = true;
  errorJugadora.value = null;
  try {
    // Eliminar documento de jugadoraRegistro
    await deleteDoc(doc(db, 'jugadoraRegistro', uid));
    return true;
  } catch (err) {
    // // console.error('Error eliminando jugadora:', err);
    errorJugadora.value = err.message;
    return false;
  } finally {
    isLoadingJugadora.value = false;
  }
};
