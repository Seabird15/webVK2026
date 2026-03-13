<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestionar Estadísticas 2026</h2>
        <p class="text-sm text-gray-500 mt-1">Las jugadoras se sincronizan desde jugadoraRegistro y se editan por equipo.</p>
      </div>

      <button
        @click="sincronizarPlantel"
        :disabled="sincronizando"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ sincronizando ? 'Sincronizando...' : 'Sincronizar plantel' }}
      </button>
    </div>

    <div class="bg-gray-50 p-4 rounded-lg space-y-4">
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Equipo</label>
          <select
            v-model="equipoSeleccionado"
            class="w-52 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ascenso">Ascenso</option>
            <option value="serieC">Serie C</option>
          </select>
        </div>

        <div class="flex gap-3">
          <button
            @click="tipoEstadistica = 'competicion'"
            class="px-5 py-2 font-bold text-xs uppercase transition-all rounded-lg cursor-pointer"
            :class="tipoEstadistica === 'competicion'
              ? 'bg-primary text-black shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            Competición
          </button>
          <button
            @click="tipoEstadistica = 'amistoso'"
            class="px-5 py-2 font-bold text-xs uppercase transition-all rounded-lg cursor-pointer"
            :class="tipoEstadistica === 'amistoso'
              ? 'bg-primary text-black shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            Amistosos
          </button>
        </div>
      </div>
    </div>

    <div v-if="mensaje" :class="[
      'p-4 rounded-lg font-bold text-white',
      mensaje.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]">
      {{ mensaje.texto }}
    </div>

    <div v-if="isLoading" class="text-center py-12 text-gray-500">
      Cargando estadísticas...
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full bg-white rounded-lg overflow-hidden shadow">
        <thead>
          <tr class="bg-primary text-white">
            <th class="px-6 py-3 text-left font-bold">Nombre</th>
            <th class="px-6 py-3 text-center font-bold">Goles</th>
            <th class="px-6 py-3 text-center font-bold">Asistencias</th>
            <th class="px-6 py-3 text-center font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="jugadora in filas" :key="jugadora.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-3">
              <div class="font-semibold text-gray-900">{{ jugadora.nombre }} {{ jugadora.apellido }}</div>
              <div class="text-xs text-gray-500">{{ jugadora.posicion || 'Sin posición' }}</div>
            </td>
            <td class="px-6 py-3 text-center">
              <div v-if="editandoId !== jugadora.id" class="text-lg font-bold text-primary">{{ jugadora.goles }}</div>
              <input
                v-else
                v-model.number="formEdicion.goles"
                type="number"
                min="0"
                class="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary"
              />
            </td>
            <td class="px-6 py-3 text-center">
              <div v-if="editandoId !== jugadora.id" class="text-lg font-bold text-primary">{{ jugadora.asistencias }}</div>
              <input
                v-else
                v-model.number="formEdicion.asistencias"
                type="number"
                min="0"
                class="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary"
              />
            </td>
            <td class="px-6 py-3 text-center">
              <div v-if="editandoId !== jugadora.id" class="flex gap-2 justify-center">
                <button
                  @click="iniciarEdicion(jugadora)"
                  class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold text-sm transition-colors"
                >
                  Editar
                </button>
              </div>
              <div v-else class="flex gap-2 justify-center">
                <button
                  @click="guardarEdicion(jugadora.id)"
                  :disabled="guardando"
                  class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded font-bold text-sm transition-colors disabled:opacity-50"
                >
                  Guardar
                </button>
                <button
                  @click="cancelarEdicion"
                  :disabled="guardando"
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded font-bold text-sm transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filas.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
              No hay jugadoras sincronizadas en este equipo.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {
  actualizarEstadisticaManualJugadora,
  obtenerEstadisticasEquipo,
  obtenerResumenPorTipo,
  sincronizarEstadisticasEquipo
} from '../firebase/estadisticas';

const equipoSeleccionado = ref('ascenso');
const tipoEstadistica = ref('competicion');
const jugadoras = ref([]);
const isLoading = ref(false);
const guardando = ref(false);
const sincronizando = ref(false);
const editandoId = ref('');
const mensaje = ref(null);
const formEdicion = ref({
  goles: 0,
  asistencias: 0
});

const filas = computed(() => {
  return jugadoras.value
    .map((jugadora) => {
      const resumen = obtenerResumenPorTipo(jugadora, tipoEstadistica.value);
      return {
        ...jugadora,
        goles: resumen.goles || 0,
        asistencias: resumen.asistencias || 0
      };
    })
    .sort((a, b) => {
      const nombreA = `${a.nombre} ${a.apellido}`.trim().toLowerCase();
      const nombreB = `${b.nombre} ${b.apellido}`.trim().toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
});

const mostrarMensaje = (texto, tipo) => {
  mensaje.value = { texto, tipo };
  setTimeout(() => {
    mensaje.value = null;
  }, 3000);
};

const cargarEstadisticas = async () => {
  isLoading.value = true;
  try {
    jugadoras.value = await obtenerEstadisticasEquipo(equipoSeleccionado.value);
  } catch (err) {
    console.error('Error cargando estadísticas:', err);
    jugadoras.value = [];
    mostrarMensaje('Error al cargar las estadísticas', 'error');
  } finally {
    isLoading.value = false;
  }
};

const sincronizarPlantel = async () => {
  sincronizando.value = true;
  try {
    await sincronizarEstadisticasEquipo(equipoSeleccionado.value);
    await cargarEstadisticas();
    mostrarMensaje('Plantel sincronizado correctamente', 'success');
  } catch (err) {
    console.error('Error sincronizando plantel:', err);
    mostrarMensaje('Error al sincronizar el plantel', 'error');
  } finally {
    sincronizando.value = false;
  }
};

const iniciarEdicion = (jugadora) => {
  editandoId.value = jugadora.id;
  formEdicion.value = {
    goles: jugadora.goles || 0,
    asistencias: jugadora.asistencias || 0
  };
};

const cancelarEdicion = () => {
  editandoId.value = '';
  formEdicion.value = {
    goles: 0,
    asistencias: 0
  };
};

const guardarEdicion = async (jugadoraId) => {
  guardando.value = true;
  try {
    await actualizarEstadisticaManualJugadora({
      equipo: equipoSeleccionado.value,
      jugadoraId,
      tipo: tipoEstadistica.value,
      goles: formEdicion.value.goles,
      asistencias: formEdicion.value.asistencias
    });

    await cargarEstadisticas();
    cancelarEdicion();
    mostrarMensaje('Estadísticas actualizadas correctamente', 'success');
  } catch (err) {
    console.error('Error guardando estadísticas:', err);
    mostrarMensaje('Error al guardar las estadísticas', 'error');
  } finally {
    guardando.value = false;
  }
};

onMounted(() => {
  cargarEstadisticas();
});

watch(() => equipoSeleccionado.value, () => {
  cancelarEdicion();
  cargarEstadisticas();
});

watch(() => tipoEstadistica.value, () => {
  cancelarEdicion();
});
</script>
