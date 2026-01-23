<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-primary-dark text-white p-6 sticky top-0 z-40">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">Entrenamientos</h1>
            <p class="text-sm text-white tracking-widest mt-1">
              <span v-if="equipoSeleccionado">{{ equipoSeleccionado === 'ascenso' ? 'Equipo Ascenso' : 'Equipo Escuela' }}</span>
            </p>
          </div>
          <button
            @click="handleLogout"
            class="bg-white text-red-500 my-2 hover:bg-opacity-90 px-4 py-2 rounded-lg font-bold transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-6xl mx-auto p-6">
      <!-- Información de jugadora -->
      <div v-if="jugadoraData" class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="flex justify-between items-start">
          <div class="flex gap-4">
            <div v-if="jugadoraData.fotoPerfil" class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img :src="jugadoraData.fotoPerfil" alt="Perfil" class="w-full h-full object-cover" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ jugadoraData.nombre }} {{ jugadoraData.apellido }}
              </h2>
              <p class="text-gray-600">{{ jugadoraData.posicion }} - Dorsal #{{ jugadoraData.dorsal }}</p>
            </div>
          </div>
          <router-link
            to="/perfil"
            class="px-4 py-2 bg-primary-dark text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Mi Perfil
          </router-link>
        </div>
      </div>

      <!-- Selector de equipo (si tiene ambos) -->
      <div v-if="jugadoraData?.equipo === 'ambos'" class="mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Selecciona equipo:</label>
          <div class="flex gap-4">
            <button
              @click="cambiarEquipo('ascenso')"
              :class="[
                'px-6 py-2 rounded-lg font-bold transition-colors',
                equipoSeleccionado === 'ascenso'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Ascenso
            </button>
            <button
              @click="cambiarEquipo('escuela')"
              :class="[
                'px-6 py-2 rounded-lg font-bold transition-colors',
                equipoSeleccionado === 'escuela'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Escuela
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Cargando entrenamientos...</p>
      </div>

      <!-- Sin entrenamientos -->
      <div v-else-if="entrenamientosFiltered.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-500 text-lg">No hay entrenamientos disponibles en este momento</p>
      </div>

      <!-- Lista de entrenamientos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="entrenamiento in entrenamientosFiltered"
          :key="entrenamiento.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
        >
          <!-- Card superior -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-1">{{ entrenamiento.titulo }}</h3>
                <p class="text-sm text-gray-500">{{ entrenamiento.equipo }}</p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold',
                  estadoInscripcion[entrenamiento.id] === 'confirmada'
                    ? 'bg-green-100 text-green-800'
                    : estadoInscripcion[entrenamiento.id] === 'baja'
                    ? 'bg-red-100 text-red-800'
                    : estadoInscripcion[entrenamiento.id] === 'pendiente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ estadoInscripcion[entrenamiento.id] || 'Sin inscribirse' }}
              </span>
            </div>

            <!-- Detalles -->
            <div class="space-y-2 mb-6 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <span class="font-bold w-24">📅 Fecha:</span>
                <span>{{ formatearFecha(entrenamiento.fecha) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold w-24">🕐 Hora:</span>
                <span>{{ entrenamiento.hora }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold w-24">📍 Lugar:</span>
                <span>{{ entrenamiento.lugar }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold w-24">👥 Inscritas:</span>
                <span>{{ contarInscritas(entrenamiento.id) }} / {{ entrenamiento.capacidad || '∞' }}</span>
              </div>
            </div>

            <!-- Descripción -->
            <p class="text-gray-600 text-sm mb-6 line-clamp-3">
              {{ entrenamiento.descripcion }}
            </p>

            <!-- Botones -->
            <div class="flex gap-2">
              <button
                v-if="!estaInscrita(entrenamiento.id)"
                @click="handleInscribirse(entrenamiento)"
                :disabled="isLoadingAccion"
                class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Inscribirse
              </button>
              <button
                v-else
                @click="handleDesuscribirse(entrenamiento)"
                :disabled="isLoadingAccion"
                class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Darse de baja
              </button>
              <button
                @click="verDetalles(entrenamiento)"
                class="px-4 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors"
              >
                Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div v-if="entrenamientoSeleccionado" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-2xl font-bold">{{ entrenamientoSeleccionado.titulo }}</h2>
          <button
            @click="entrenamientoSeleccionado = null"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <h3 class="font-bold text-gray-700 mb-1">Descripción</h3>
            <p class="text-gray-600">{{ entrenamientoSeleccionado.descripcion }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold text-gray-700 mb-1">Fecha</h3>
              <p class="text-gray-600">{{ formatearFecha(entrenamientoSeleccionado.fecha) }}</p>
            </div>
            <div>
              <h3 class="font-bold text-gray-700 mb-1">Hora</h3>
              <p class="text-gray-600">{{ entrenamientoSeleccionado.hora }}</p>
            </div>
            <div>
              <h3 class="font-bold text-gray-700 mb-1">Lugar</h3>
              <p class="text-gray-600">{{ entrenamientoSeleccionado.lugar }}</p>
            </div>
            <div>
              <h3 class="font-bold text-gray-700 mb-1">Equipo</h3>
              <p class="text-gray-600">{{ entrenamientoSeleccionado.equipo }}</p>
            </div>
          </div>

          <div>
            <h3 class="font-bold text-gray-700 mb-2">Inscritas ({{ contarInscritas(entrenamientoSeleccionado.id) }})</h3>
            <div class="space-y-4">
              <!-- Confirmadas -->
              <div v-if="inscritasOrganizadas.confirmadas.length > 0">
                <h4 class="font-semibold text-green-700 text-sm mb-2 flex items-center gap-2">
                  <span class="text-lg">✓</span> Confirmadas ({{ inscritasOrganizadas.confirmadas.length }})
                </h4>
                <div class="bg-green-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <transition-group name="fade" tag="ul" class="space-y-2">
                    <li
                      v-for="inscrita in inscritasOrganizadas.confirmadas"
                      :key="inscrita.id"
                      class="text-sm text-gray-700 py-1 px-2 rounded bg-green-100 flex items-center gap-2 transition-all"
                    >
                      <span class="text-green-600 font-bold">✓</span>
                      {{ inscrita.jugadoraNombre }}
                    </li>
                  </transition-group>
                </div>
              </div>

              <!-- Bajas -->
              <div v-if="inscritasOrganizadas.bajas.length > 0">
                <h4 class="font-semibold text-red-700 text-sm mb-2 flex items-center gap-2">
                  <span class="text-lg">✕</span> Baja ({{ inscritasOrganizadas.bajas.length }})
                </h4>
                <div class="bg-red-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <transition-group name="fade" tag="ul" class="space-y-2">
                    <li
                      v-for="inscrita in inscritasOrganizadas.bajas"
                      :key="inscrita.id"
                      class="text-sm text-gray-700 py-1 px-2 rounded bg-red-100 flex items-center gap-2 transition-all"
                    >
                      <span class="text-red-600 font-bold">✕</span>
                      {{ inscrita.jugadoraNombre }}
                    </li>
                  </transition-group>
                </div>
              </div>

              <!-- Pendientes -->
              <div v-if="inscritasOrganizadas.pendientes.length > 0">
                <h4 class="font-semibold text-yellow-700 text-sm mb-2 flex items-center gap-2">
                  <span class="text-lg">?</span> Sin respuesta ({{ inscritasOrganizadas.pendientes.length }})
                </h4>
                <div class="bg-yellow-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <transition-group name="fade" tag="ul" class="space-y-2">
                    <li
                      v-for="inscrita in inscritasOrganizadas.pendientes"
                      :key="inscrita.id"
                      class="text-sm text-gray-700 py-1 px-2 rounded bg-yellow-100 flex items-center gap-2 transition-all"
                    >
                      <span class="text-yellow-600 font-bold">?</span>
                      {{ inscrita.jugadoraNombre }}
                    </li>
                  </transition-group>
                </div>
              </div>

              <!-- Si no hay inscritas -->
              <div v-if="inscritasOrganizadas.confirmadas.length === 0 && inscritasOrganizadas.bajas.length === 0 && inscritasOrganizadas.pendientes.length === 0" class="text-gray-500 text-sm text-center py-4">
                No hay inscritas aún
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 flex gap-2">
          <button
            @click="entrenamientoSeleccionado = null"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
          <button
            v-if="!estaInscrita(entrenamientoSeleccionado.id)"
            @click="handleInscribirse(entrenamientoSeleccionado)"
            :disabled="isLoadingAccion"
            class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Inscribirse
          </button>
          <button
            v-else
            @click="handleDesuscribirse(entrenamientoSeleccionado)"
            :disabled="isLoadingAccion"
            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Darse de baja
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de confirmación -->
    <div v-if="toastMensaje" :class="[
      'fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white font-bold transition-opacity',
      toastTipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]">
      {{ toastMensaje }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logoutJugadora, jugadoraAuthUser, jugadoraData } from '../firebase/jugadorasAuth';
import { fetchEntrenamientosPorEquipo, entrenamientos, isLoadingEntrenamientos } from '../firebase/entrenamientos';
import { 
  inscribirseEntrenamiento, 
  desuscribirseEntrenamiento, 
  fetchInscripcionesEntrenamiento,
  estaInscrita as checkInscrita,
  obtenerEstadoInscripcion,
  escucharInscripcionesEntrenamiento,
  isLoadingInscripciones,
  errorInscripciones
} from '../firebase/inscripciones';

const router = useRouter();
const equipoSeleccionado = ref(localStorage.getItem('categoriaSeleccionada') || jugadoraData.value?.equipo || 'ascenso');
const entrenamientoSeleccionado = ref(null);
const inscritasEntrenamiento = ref([]);
const inscritasOrganizadas = ref({
  confirmadas: [],
  bajas: [],
  pendientes: []
});
const estadoInscripcion = ref({});
const conteoInscritas = ref({}); // NUEVO: Mapeo de conteos por entrenamiento
const toastMensaje = ref(null);
const toastTipo = ref('success');
const isLoadingAccion = ref(false);
const unsubscribers = ref([]);

// Verificar autenticación
if (!jugadoraAuthUser.value) {
  router.push('/login-jugadora');
}

const entrenamientosFiltered = computed(() => {
  return entrenamientos.value.filter(e => e.equipo === equipoSeleccionado.value);
});

const isLoading = computed(() => isLoadingEntrenamientos.value);

const cambiarEquipo = (equipo) => {
  equipoSeleccionado.value = equipo;
  localStorage.setItem('categoriaSeleccionada', equipo);
  cargarEntrenamientos();
  actualizarEstados();
};

const cargarEntrenamientos = async () => {
  await fetchEntrenamientosPorEquipo(equipoSeleccionado.value);
  await actualizarEstados();
};

const actualizarEstados = async () => {
  for (const entrenamiento of entrenamientos.value) {
    const estado = await obtenerEstadoInscripcion(entrenamiento.id, jugadoraAuthUser.value.uid);
    estadoInscripcion.value[entrenamiento.id] = estado;
  }
};

const contarInscritas = (entrenamientoId) => {
  const conteo = conteoInscritas.value[entrenamientoId];
  if (!conteo) return 0;
  return conteo.confirmadas + conteo.bajas + conteo.pendientes;
};

const estaInscrita = (entrenamientoId) => {
  return estadoInscripcion.value[entrenamientoId] !== null && estadoInscripcion.value[entrenamientoId] !== undefined;
};

const verDetalles = async (entrenamiento) => {
  entrenamientoSeleccionado.value = entrenamiento;
  
  // Desuscribir de listeners anteriores
  unsubscribers.value.forEach(unsub => unsub());
  unsubscribers.value = [];

  // Iniciar listener en tiempo real
  const unsubscribe = escucharInscripcionesEntrenamiento(entrenamiento.id, (organizadas) => {
    inscritasOrganizadas.value = organizadas;
    inscritasEntrenamiento.value = [
      ...organizadas.confirmadas,
      ...organizadas.bajas,
      ...organizadas.pendientes
    ];
    
    // NUEVO: Actualizar conteo para este entrenamiento
    conteoInscritas.value[entrenamiento.id] = {
      confirmadas: organizadas.confirmadas.length,
      bajas: organizadas.bajas.length,
      pendientes: organizadas.pendientes.length
    };
  });

  unsubscribers.value.push(unsubscribe);
};

const handleInscribirse = async (entrenamiento) => {
  if (!jugadoraData.value) return;
  
  isLoadingAccion.value = true;
  const success = await inscribirseEntrenamiento(
    entrenamiento.id,
    jugadoraAuthUser.value.uid,
    `${jugadoraData.value.nombre} ${jugadoraData.value.apellido}`
  );

  if (success) {
    mostrarToast('¡Inscrita correctamente!', 'success');
    await actualizarEstados();
  } else {
    mostrarToast(errorInscripciones.value || 'Error al inscribirse', 'error');
  }
  isLoadingAccion.value = false;
};

const handleDesuscribirse = async (entrenamiento) => {
  isLoadingAccion.value = true;
  const success = await desuscribirseEntrenamiento(
    entrenamiento.id,
    jugadoraAuthUser.value.uid
  );

  if (success) {
    mostrarToast('Te diste de baja correctamente', 'success');
    await actualizarEstados();
  } else {
    mostrarToast(errorInscripciones.value || 'Error al darse de baja', 'error');
  }
  isLoadingAccion.value = false;
};

const mostrarToast = (mensaje, tipo) => {
  toastMensaje.value = mensaje;
  toastTipo.value = tipo;
  setTimeout(() => {
    toastMensaje.value = null;
  }, 3000);
};

const formatearFecha = (date) => {
  if (!date) return '-';
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleLogout = async () => {
  await logoutJugadora();
  router.push('/');
};

onMounted(() => {
  cargarEntrenamientos();
  
  // NUEVO: Iniciar listeners para todos los entrenamientos para actualizar conteos
  const iniciarListenersTodos = async () => {
    await new Promise(r => setTimeout(r, 500)); // Esperar a que carguen entrenamientos
    
    for (const ent of entrenamientos.value) {
      const unsub = escucharInscripcionesEntrenamiento(ent.id, (organizadas) => {
        // Actualizar conteo para tarjetas
        conteoInscritas.value[ent.id] = {
          confirmadas: organizadas.confirmadas.length,
          bajas: organizadas.bajas.length,
          pendientes: organizadas.pendientes.length
        };
      });
      
      unsubscribers.value.push(unsub);
    }
  };
  
  iniciarListenersTodos();
});

// Limpiar listeners cuando se desmonta el componente
onUnmounted(() => {
  unsubscribers.value.forEach(unsub => unsub());
  unsubscribers.value = [];
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.fade-move {
  transition: transform 0.3s ease;
}
</style>
