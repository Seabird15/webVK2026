<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Nota para el admin -->
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700 font-semibold">
            Vista de Administrador - Puedes ver y gestionar los entrenamientos como una jugadora. Esta vista es solo para ti.
          </p>
        </div>
      </div>
    </div>

    <!-- Selector de equipo -->
    <div class="mb-6">
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
          <button
            @click="cambiarEquipo('ambos')"
            :class="[
              'px-6 py-2 rounded-lg font-bold transition-colors',
              equipoSeleccionado === 'ambos'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Eventos
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
      <p class="text-gray-500 text-lg">No hay eventos disponibles en este momento</p>
    </div>

    <!-- Lista de entrenamientos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="entrenamiento in entrenamientosFiltered"
        :key="entrenamiento.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
      >
        <!-- Card -->
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ entrenamiento.nombre }}</h3>
              <span v-if="entrenamiento.esConvocatoria" class="inline-block mt-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                📋 Convocatoria
              </span>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              ADMIN
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
              @click="verDetalles(entrenamiento)"
              class="flex-1 px-3 py-2 border border-primary text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-colors text-sm"
            >
              📋 Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div v-if="entrenamientoSeleccionado" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">{{ entrenamientoSeleccionado.nombre }}</h2>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">Vista Admin</span>
          </div>
          <button
            @click="entrenamientoSeleccionado = null"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div v-if="entrenamientoSeleccionado.esConvocatoria" class="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <h3 class="font-bold text-purple-900 mb-2 flex items-center gap-2">
              📋 Partido con Convocatoria
            </h3>
            <p class="text-sm text-purple-800">
              Solo las jugadoras convocadas pueden confirmar su asistencia a este partido.
            </p>
          </div>

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
            <h3 class="font-bold text-gray-700 mb-4">Estado de Asistencia</h3>
            <div class="space-y-4">
              <!-- Confirmadas -->
              <div>
                <h4 class="font-semibold text-green-700 text-sm mb-2 flex items-center gap-2">
                  <span class="text-lg">✓</span> Confirmadas ({{ inscritasOrganizadas.confirmadas.length }})
                </h4>
                <div v-if="inscritasOrganizadas.confirmadas.length > 0" class="bg-green-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <ul class="space-y-2">
                    <li
                      v-for="inscrita in inscritasOrganizadas.confirmadas"
                      :key="inscrita.id"
                      class="text-sm text-gray-700 py-1 px-2 rounded bg-green-100 flex items-center gap-2"
                    >
                      <span class="text-green-600 font-bold">✓</span>
                      {{ inscrita.jugadoraNombre }}
                    </li>
                  </ul>
                </div>
                <div v-else class="text-gray-400 text-sm italic py-2">
                  No hay jugadoras confirmadas
                </div>
              </div>

              <!-- Bajas -->
              <div>
                <h4 class="font-semibold text-red-700 text-sm mb-2 flex items-center gap-2">
                  <span class="text-lg">✕</span> Bajas ({{ inscritasOrganizadas.bajas.length }})
                </h4>
                <div v-if="inscritasOrganizadas.bajas.length > 0" class="bg-red-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <ul class="space-y-2">
                    <li
                      v-for="inscrita in inscritasOrganizadas.bajas"
                      :key="inscrita.id"
                      class="text-sm text-gray-700 py-1 px-2 rounded bg-red-100"
                    >
                      <div class="flex items-center gap-2">
                        <span class="text-red-600 font-bold">✕</span>
                        <span class="font-semibold">{{ inscrita.jugadoraNombre }}</span>
                      </div>
                      <div v-if="inscrita.motivoBaja" class="mt-1 ml-6 text-xs text-gray-600 italic">
                        Motivo: {{ inscrita.motivoBaja }}
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-else class="text-gray-400 text-sm italic py-2">
                  No hay jugadoras dadas de baja
                </div>
              </div>

              <!-- Pendientes -->
              <div>
                <h4 class="font-semibold text-yellow-700 text-sm mb-2 flex items-center gap-2">
                  <span class="text-lg">?</span> Pendientes ({{ inscritasOrganizadas.pendientes.length }})
                </h4>
                <div v-if="inscritasOrganizadas.pendientes.length > 0" class="bg-yellow-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <ul class="space-y-2">
                    <li
                      v-for="inscrita in inscritasOrganizadas.pendientes"
                      :key="inscrita.id"
                      class="text-sm text-gray-700 py-1 px-2 rounded bg-yellow-100 flex items-center gap-2"
                    >
                      <span class="text-yellow-600 font-bold">?</span>
                      {{ inscrita.jugadoraNombre }}
                    </li>
                  </ul>
                </div>
                <div v-else class="text-gray-400 text-sm italic py-2">
                  Todas han respondido
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
          <div class="flex gap-2">
            <button
              @click="entrenamientoSeleccionado = null"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { fetchEntrenamientosPorEquipo, entrenamientos, isLoadingEntrenamientos } from '../firebase/entrenamientos';
import { 
  escucharInscripcionesEntrenamiento
} from '../firebase/inscripciones';

const equipoSeleccionado = ref('ascenso');
const entrenamientoSeleccionado = ref(null);
const inscritasOrganizadas = ref({
  confirmadas: [],
  bajas: [],
  pendientes: []
});
const conteoInscritas = ref({});
const unsubscribers = ref([]);

const entrenamientosFiltered = computed(() => {
  return entrenamientos.value.filter(e => e.equipo === equipoSeleccionado.value);
});

const isLoading = computed(() => isLoadingEntrenamientos.value);

const cambiarEquipo = (equipo) => {
  equipoSeleccionado.value = equipo;
  cargarEntrenamientos();
};

const cargarEntrenamientos = async () => {
  await fetchEntrenamientosPorEquipo(equipoSeleccionado.value);
};

const contarInscritas = (entrenamientoId) => {
  const conteo = conteoInscritas.value[entrenamientoId];
  if (!conteo) return 0;
  return conteo.confirmadas + conteo.bajas + conteo.pendientes;
};

const verDetalles = async (entrenamiento) => {
  entrenamientoSeleccionado.value = entrenamiento;
  
  // Desuscribir de listeners anteriores
  unsubscribers.value.forEach(unsub => unsub());
  unsubscribers.value = [];

  // Iniciar listener en tiempo real
  const unsubscribe = escucharInscripcionesEntrenamiento(entrenamiento.id, (organizadas) => {
    inscritasOrganizadas.value = organizadas;
    
    conteoInscritas.value[entrenamiento.id] = {
      confirmadas: organizadas.confirmadas.length,
      bajas: organizadas.bajas.length,
      pendientes: organizadas.pendientes.length
    };
  });

  unsubscribers.value.push(unsubscribe);
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

onMounted(() => {
  cargarEntrenamientos();
  
  // Iniciar listeners para todos los entrenamientos
  const iniciarListenersTodos = async () => {
    await new Promise(r => setTimeout(r, 500));
    
    for (const ent of entrenamientos.value) {
      const unsub = escucharInscripcionesEntrenamiento(ent.id, (organizadas) => {
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
