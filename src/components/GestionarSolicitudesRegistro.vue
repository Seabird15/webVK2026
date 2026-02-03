<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Solicitudes de Registro</h2>
      <p class="text-gray-600 mb-6">Gestiona las solicitudes de acceso de nuevas jugadoras</p>
    </div>

    <!-- Tabs de estado -->
    <div class="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <div class="flex gap-2 md:gap-4 border-b border-gray-200 mb-6 min-w-max md:min-w-0">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="filtroEstado = tab.value"
          :class="[
            'px-3 md:px-4 py-2 font-bold text-xs md:text-sm uppercase transition-colors whitespace-nowrap cursor-pointer',
            filtroEstado === tab.value
              ? 'text-primary border-b-2 border-primary -mb-0.5'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          {{ tab.label }}
          <span class="ml-1 md:ml-2 text-xs bg-gray-200 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
            {{ contarSolicitudes(tab.value) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <p class="text-gray-500">Cargando solicitudes...</p>
    </div>

    <!-- Sin solicitudes -->
    <div v-else-if="solicitudesFiltradas.length === 0" class="text-center py-8">
      <p class="text-gray-500">No hay solicitudes en este estado</p>
    </div>

    <!-- Vista de solicitudes -->
    <div v-else>
      <!-- Vista Mobile (Tarjetas) -->
      <div class="md:hidden space-y-4">
        <div
          v-for="solicitud in solicitudesFiltradas"
          :key="solicitud.id"
          class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 break-all">{{ solicitud.email }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatearFecha(solicitud.createdAt) }}</p>
            </div>
            <span
              :class="[
                'ml-2 px-2 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap',
                solicitud.estado === 'pendiente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : solicitud.estado === 'aprobada'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ solicitud.estado }}
            </span>
          </div>
          
          <div v-if="solicitud.estado === 'pendiente'" class="flex gap-2 mt-3">
            <button
              @click="abrirModal('aprobar', solicitud)"
              class="flex-1 px-3 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
            >
              ✓ Aprobar
            </button>
            <button
              @click="abrirModal('rechazar', solicitud)"
              class="flex-1 px-3 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              ✕ Rechazar
            </button>
          </div>
        </div>
      </div>

      <!-- Vista Desktop (Tabla) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Fecha</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="solicitud in solicitudesFiltradas"
              :key="solicitud.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">{{ solicitud.email }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold uppercase',
                    solicitud.estado === 'pendiente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : solicitud.estado === 'aprobada'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ solicitud.estado }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatearFecha(solicitud.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button
                  v-if="solicitud.estado === 'pendiente'"
                  @click="abrirModal('aprobar', solicitud)"
                  class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Aprobar
                </button>
                <button
                  v-if="solicitud.estado === 'pendiente'"
                  @click="abrirModal('rechazar', solicitud)"
                  class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Rechazar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="modalAbierto" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-4 md:p-6 max-w-md w-full">
        <h3 class="text-lg md:text-xl font-bold mb-3 md:mb-4">
          {{ tipoAccion === 'aprobar' ? '¿Aprobar solicitud?' : '¿Rechazar solicitud?' }}
        </h3>
        <p class="text-sm md:text-base text-gray-600 mb-4 break-all">
          Email: <strong>{{ solicitudSeleccionada?.email }}</strong>
        </p>

        <!-- Campo de razón (solo para rechazo) -->
        <div v-if="tipoAccion === 'rechazar'" class="mb-4">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Motivo del rechazo (opcional)
          </label>
          <textarea
            v-model="razonRechazo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            placeholder="Ej: No cumples los requisitos..."
          ></textarea>
        </div>

        <!-- Errores -->
        <div v-if="errorAccion" class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {{ errorAccion }}
        </div>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            @click="cerrarModal"
            class="flex-1 px-4 py-2.5 md:py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors order-2 sm:order-1 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            @click="ejecutarAccion"
            :disabled="isLoading"
            :class="[
              'flex-1 px-4 py-2.5 md:py-2 text-white font-bold rounded-lg transition-colors disabled:opacity-50 order-1 sm:order-2 cursor-pointer',
              tipoAccion === 'aprobar'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            ]"
          >
            {{ isLoading ? 'Procesando...' : (tipoAccion === 'aprobar' ? 'Aprobar' : 'Rechazar') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchTodasSolicitudes, aprobarSolicitud, rechazarSolicitud, solicitudes, isLoadingSolicitudes, errorSolicitudes } from '../firebase/solicitudesRegistro';

const filtroEstado = ref('pendiente');
const modalAbierto = ref(false);
const tipoAccion = ref(null);
const solicitudSeleccionada = ref(null);
const razonRechazo = ref('');
const errorAccion = ref(null);
const isLoading = ref(false);

const tabs = [
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Aprobadas', value: 'aprobada' },
  { label: 'Rechazadas', value: 'rechazada' }
];

const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter(s => s.estado === filtroEstado.value);
});

const contarSolicitudes = (estado) => {
  return solicitudes.value.filter(s => s.estado === estado).length;
};

const formatearFecha = (date) => {
  if (!date) return '-';
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const abrirModal = (tipo, solicitud) => {
  tipoAccion.value = tipo;
  solicitudSeleccionada.value = solicitud;
  razonRechazo.value = '';
  errorAccion.value = null;
  modalAbierto.value = true;
};

const cerrarModal = () => {
  modalAbierto.value = false;
  solicitudSeleccionada.value = null;
};

const ejecutarAccion = async () => {
  isLoading.value = true;
  errorAccion.value = null;

  try {
    const uid = solicitudSeleccionada.value.id;

    if (tipoAccion.value === 'aprobar') {
      const success = await aprobarSolicitud(uid, solicitudSeleccionada.value.email);
      if (success) {
        cerrarModal();
        // Recargar solicitudes
        await fetchTodasSolicitudes();
      } else {
        errorAccion.value = errorSolicitudes.value || 'Error al aprobar solicitud';
      }
    } else {
      const success = await rechazarSolicitud(uid, razonRechazo.value);
      if (success) {
        cerrarModal();
        // Recargar solicitudes
        await fetchTodasSolicitudes();
      } else {
        errorAccion.value = errorSolicitudes.value || 'Error al rechazar solicitud';
      }
    }
  } catch (err) {
    errorAccion.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchTodasSolicitudes();
});
</script>
