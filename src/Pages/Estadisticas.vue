<template>
  <div class="w-full bg-white">
    <!-- Header -->
    <div class="bg-linear-to-r from-primary-dark to-primary/80 px-3 md:px-8 py-6 md:py-12">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl md:text-4xl font-bold text-white mb-1">Estadísticas 2026</h1>
        <p class="text-white text-xs md:text-base">Goleadoras y asistidoras por equipo</p>
      </div>
    </div>

    <!-- Pestañas de equipos -->
    <div class="bg-white border-b border-gray-300 overflow-x-auto">
      <div class="max-w-6xl mx-auto px-2 md:px-8">
        <div class="flex gap-1 md:gap-8 min-w-min md:min-w-0">
          <button
            v-for="equipo in equipos"
            :key="equipo.id"
            @click="equipoActivo = equipo.id"
            class="py-3 md:py-4 px-3 md:px-4 font-bold text-xs md:text-base uppercase transition-all border-b-2 whitespace-nowrap"
            :class="equipoActivo === equipo.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-primary'"
          >
            {{ equipo.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Cargando estadísticas...</p>
      </div>

      <div v-else class="space-y-12">
        <!-- Goleadoras -->
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <FireIcon class="w-8 h-8" />
            Goleadoras
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-primary/10 border-b-2 border-primary">
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-gray-900">#</th>
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-gray-900">Nombre</th>
                  <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">Goles</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(jugadora, index) in goleadorasOrdenadas"
                  :key="jugadora.id"
                  class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm md:text-base font-bold text-primary">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm md:text-base font-semibold text-gray-900">
                    {{ jugadora.nombre }} {{ jugadora.apellido }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm md:text-base">
                      {{ jugadora.goles || 0 }}
                    </span>
                  </td>
                </tr>
                <tr v-if="goleadorasOrdenadas.length === 0">
                  <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                    Sin registros de goles aún
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Asistidoras -->
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <SparklesIcon class="w-8 h-8" />
            Asistidoras
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-primary/10 border-b-2 border-primary">
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-gray-900">#</th>
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-gray-900">Nombre</th>
                  <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">Asistencias</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(jugadora, index) in asistidorasOrdenadas"
                  :key="jugadora.id"
                  class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td class="px-4 py-3 text-sm md:text-base font-bold text-primary">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm md:text-base font-semibold text-gray-900">
                    {{ jugadora.nombre }} {{ jugadora.apellido }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm md:text-base">
                      {{ jugadora.asistencias || 0 }}
                    </span>
                  </td>
                </tr>
                <tr v-if="asistidorasOrdenadas.length === 0">
                  <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                    Sin registros de asistencias aún
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tabla completa de estadísticas -->
        <div class="bg-gray-50 rounded-lg p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Estadísticas Completas</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-primary border-b-2 border-primary">
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-white">#</th>
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-white">Nombre</th>
                  <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-white">Goles</th>
                  <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-white">Asistencias</th>
                  <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-white">Participaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(jugadora, index) in estadisticasCompletas"
                  :key="jugadora.id"
                  class="border-b border-gray-200 hover:bg-white transition-colors"
                >
                  <td class="px-4 py-3 text-sm md:text-base font-bold text-primary">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm md:text-base font-semibold text-gray-900">
                    {{ jugadora.nombre }} {{ jugadora.apellido }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm md:text-base font-semibold text-gray-900">
                    {{ jugadora.goles || 0 }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm md:text-base font-semibold text-gray-900">
                    {{ jugadora.asistencias || 0 }}
                  </td>
                  <td class="px-4 py-3 text-center text-sm md:text-base font-semibold text-gray-900">
                    {{ (jugadora.goles || 0) + (jugadora.asistencias || 0) }}
                  </td>
                </tr>
                <tr v-if="estadisticasCompletas.length === 0">
                  <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                    No hay jugadoras registradas en este equipo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FireIcon } from '@heroicons/vue/24/solid';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';

const isLoading = ref(false);
const equipoActivo = ref('ascenso');
const jugadoras = ref([]);

const equipos = [
  { id: 'ascenso', label: 'Ascenso' },
  { id: 'escuela', label: 'Escuela' }
];

// Obtener goleadoras ordenadas por mayor a menor
const goleadorasOrdenadas = computed(() => {
  return [...jugadoras.value]
    .sort((a, b) => (b.goles || 0) - (a.goles || 0))
    .filter(j => (j.goles || 0) > 0);
});

// Obtener asistidoras ordenadas por mayor a menor
const asistidorasOrdenadas = computed(() => {
  return [...jugadoras.value]
    .sort((a, b) => (b.asistencias || 0) - (a.asistencias || 0))
    .filter(j => (j.asistencias || 0) > 0);
});

// Estadísticas completas ordenadas por mayor participación
const estadisticasCompletas = computed(() => {
  return [...jugadoras.value]
    .sort((a, b) => {
      const participacionA = (a.goles || 0) + (a.asistencias || 0);
      const participacionB = (b.goles || 0) + (b.asistencias || 0);
      return participacionB - participacionA;
    });
});

// Cargar jugadoras por equipo
const cargarJugadoras = async () => {
  isLoading.value = true;
  try {
    const q = query(
      collection(db, 'estadisticas'),
      where('equipo', '==', equipoActivo.value)
    );
    const snapshot = await getDocs(q);
    jugadoras.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error cargando estadísticas:', err);
    jugadoras.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  cargarJugadoras();
});

// Watcher para cambios de equipo
watch(() => equipoActivo.value, () => {
  cargarJugadoras();
});
</script>
