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
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { normalizarDisponibilidadEntrenamientos } from '../utils/disponibilidadEntrenamientos';

export const jugadoraAuthUser = ref(null);
export const jugadoraData = ref(null);
export const isLoadingJugadora = ref(false);
export const errorJugadora = ref(null);
export const authReady = ref(false); // Flag para saber cuando Auth está listo

// Listener para cambios en tiempo real de datos de jugadora
let unsubscribeJugadoraData = null;

const EQUIPOS_VALIDOS = ['ascenso', 'escuela', 'serieC'];

const normalizarCategoriaEquipo = (valor) => {
  if (!valor) return '';
  const normalizado = valor
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_-]+/g, '');

  // Retornar 'serieC' consistente con el resto del código
  if (normalizado === 'seriec') return 'serieC';
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
  if (equiposNormalizados.length > 1) {
    return 'ambos';
  }

  return equiposNormalizados[0];
};

const normalizarDatosJugadora = (uid, data = {}) => {
  const equipos = obtenerEquiposJugadoraDesdeDatos(data);
  const equipo = convertirEquiposAString(equipos);
  const disponibilidadEntrenamientos = normalizarDisponibilidadEntrenamientos(
    data?.disponibilidadEntrenamientos || {},
    equipos
  );

  return {
    id: uid,
    ...data,
    ...(equipos.length > 0 ? { equipos, equipo, disponibilidadEntrenamientos } : {})
  };
};

const obtenerEstadoAccesoJugadora = async (uid) => {
  if (!uid) return null;

  const [jugadoraDoc, loginDoc] = await Promise.all([
    getDoc(doc(db, 'jugadoras', uid)),
    getDoc(doc(db, 'jugadorasLogin', uid))
  ]);

  return jugadoraDoc.data()?.estado || loginDoc.data()?.estado || null;
};

const obtenerMensajeEstadoAcceso = (estado) => {
  if (estado === 'pendiente') {
    return 'Tu acceso aun no ha sido aprobado por administracion.';
  }

  if (estado === 'rechazada') {
    return 'Tu solicitud de acceso fue rechazada. Contacta a administracion para mas informacion.';
  }

  return 'Tu cuenta no tiene acceso habilitado todavia.';
};

export const tieneAccesoAprobadoJugadora = async (uid = jugadoraAuthUser.value?.uid) => {
  const estadoAcceso = await obtenerEstadoAccesoJugadora(uid);
  return estadoAcceso === 'aprobada';
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
  
  // Limpiar listener anterior si existe
  if (unsubscribeJugadoraData) {
    unsubscribeJugadoraData();
    unsubscribeJugadoraData = null;
  }
  
  // Si debemos ignorar este cambio, solo marcamos el flag como falso
  if (ignorarProximoAuthChange) {
    ignorarProximoAuthChange = false;
    authReady.value = true; // Marcar que Auth está listo
    return;
  }
  
  jugadoraAuthUser.value = user;
  
  if (user) {
    const estadoAcceso = await obtenerEstadoAccesoJugadora(user.uid);

    if (estadoAcceso !== 'aprobada') {
      errorJugadora.value = obtenerMensajeEstadoAcceso(estadoAcceso);
      jugadoraAuthUser.value = null;
      jugadoraData.value = null;
      await signOut(auth);
      authReady.value = true;
      return;
    }

    // Intentar cargar datos de Firestore
    // Si el documento no existe, es normal (aún no completó perfil)
    const jugadoraRegistroDoc = await getDoc(doc(db, 'jugadoraRegistro', user.uid));
    
    if (jugadoraRegistroDoc.exists()) {
      jugadoraData.value = normalizarDatosJugadora(user.uid, jugadoraRegistroDoc.data());
      
      // ✅ IMPORTANTE: Establecer listener en tiempo real para cambios en datos de jugadora
      // Esto permite que cuando el admin actualice la disponibilidad, la jugadora vea los cambios inmediatamente
      unsubscribeJugadoraData = onSnapshot(
        doc(db, 'jugadoraRegistro', user.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const nuevosDatos = normalizarDatosJugadora(user.uid, docSnap.data());
            jugadoraData.value = nuevosDatos;
            console.log('✅ Datos de jugadora actualizados en tiempo real:', {
              nombre: nuevosDatos.nombre,
              disponibilidad: nuevosDatos.disponibilidadEntrenamientos
            });
          }
        },
        (error) => {
          console.error('❌ Error en listener de datos de jugadora:', error);
        }
      );
    } else {
      // Si no existe, crear estado vacío (perfil no completado aún)
      jugadoraData.value = {
        id: user.uid,
        perfilCompleto: false
      };
    }
  } else {
    jugadoraData.value = null;
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
    const estadoAcceso = await obtenerEstadoAccesoJugadora(uid);

    if (estadoAcceso !== 'aprobada') {
      await signOut(auth);
      jugadoraAuthUser.value = null;
      jugadoraData.value = null;
      errorJugadora.value = obtenerMensajeEstadoAcceso(estadoAcceso);
      return false;
    }
    
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
    const registroSnapshot = await getDocs(collection(db, 'jugadoraRegistro'));

    const [loginSnapshot, accesoSnapshot] = await Promise.all([
      getDocs(collection(db, 'jugadorasLogin')).catch(() => null),
      getDocs(collection(db, 'jugadoras')).catch(() => null)
    ]);

    const emailsLoginPorId = new Map(
      (loginSnapshot?.docs || []).map((docSnap) => [docSnap.id, docSnap.data()?.email || ''])
    );
    const emailsAccesoPorId = new Map(
      (accesoSnapshot?.docs || []).map((docSnap) => [docSnap.id, docSnap.data()?.email || ''])
    );

    const jugadoras = registroSnapshot.docs.map((docSnap) => {
      const data = docSnap.data() || {};
      const emailRegistro = data.email || emailsLoginPorId.get(docSnap.id) || emailsAccesoPorId.get(docSnap.id) || '';

      return {
        id: docSnap.id,
        ...data,
        email: emailRegistro
      };
    });

    if (equipo === 'ambos') {
      return jugadoras;
    }

    return jugadoras.filter(jugadora => pertenecePorEquipo(jugadora, equipo));
  } catch (err) {
    // // console.error('Error obteniendo jugadoras registradas:', err);
    return [];
  }
};

// Verificar si una jugadora pertenece a un equipo
const pertenecePorEquipo = (jugadora, equipo) => {
  const equipoObjetivo = normalizarCategoriaEquipo(equipo);

  // Soportar formato nuevo: equipos como array
  if (Array.isArray(jugadora.equipos)) {
    return jugadora.equipos.map(normalizarCategoriaEquipo).includes(equipoObjetivo);
  }

  const equipoNormalizado = normalizarCategoriaEquipo(jugadora.equipo);

  // Soportar formato antiguo: equipo como string
  if (equipoObjetivo === 'ascenso') {
    return equipoNormalizado === 'ascenso' || equipoNormalizado === 'ambos';
  } else if (equipoObjetivo === 'escuela') {
    return equipoNormalizado === 'escuela' || equipoNormalizado === 'ambos';
  } else if (equipoObjetivo === 'serieC') {
    return equipoNormalizado === 'serieC';
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
    const estadoAcceso = await obtenerEstadoAccesoJugadora(uid);

    if (estadoAcceso !== 'aprobada') {
      errorJugadora.value = obtenerMensajeEstadoAcceso(estadoAcceso);
      await signOut(auth);
      jugadoraAuthUser.value = null;
      jugadoraData.value = null;
      return false;
    }
    
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
      disponibilidadEntrenamientos: normalizarDisponibilidadEntrenamientos(
        perfilData?.disponibilidadEntrenamientos || {},
        obtenerEquiposJugadoraDesdeDatos(perfilData)
      ),
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
    const { estadoSalud: _estadoSaludIgnorado, ...perfilSinEstado } = perfilData || {};
    const equiposNormalizados = obtenerEquiposJugadoraDesdeDatos(perfilSinEstado);
    const equipoLegacy = convertirEquiposAString(equiposNormalizados);
    const dataToUpdate = {
      ...perfilSinEstado,
      equipos: equiposNormalizados,
      equipo: equipoLegacy,
      disponibilidadEntrenamientos: normalizarDisponibilidadEntrenamientos(
        perfilSinEstado?.disponibilidadEntrenamientos || {},
        equiposNormalizados
      ),
      categoriaSeleccionada: resolverCategoriaSeleccionada(
        equipoLegacy,
        perfilSinEstado?.categoriaSeleccionada,
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
    // Limpiar listener de cambios en tiempo real
    if (unsubscribeJugadoraData) {
      unsubscribeJugadoraData();
      unsubscribeJugadoraData = null;
    }
    
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
