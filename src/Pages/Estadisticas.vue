<template>
  <div class="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-2" style="font-family: 'Gobold High', sans-serif;">ESTADÍSTICAS</h1>
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="h-1 w-12 bg-primary rounded-full"></div>
          <p class="text-primary font-bold text-lg tracking-widest">
            TEMPORADA 2026
          </p>
          <div class="h-1 w-12 bg-primary rounded-full"></div>
        </div>
        
        <!-- Botón a Competencias -->
        <div class="mt-6">
          <router-link
            to="/competencias"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-xl"
          >
            <TrophyIcon class="w-5 h-5" />
            Ver Competencias
          </router-link>
        </div>
      </div>

      <!-- Pestañas de equipos -->
      <div class="flex justify-center gap-4 mb-8">
        <button
          v-for="equipo in equipos"
          :key="equipo.id"
          @click="equipoActivo = equipo.id"
          class="px-6 py-3 font-bold text-sm uppercase transition-all rounded-lg cursor-pointer"
          :class="equipoActivo === equipo.id
            ? 'bg-primary text-black'
            : 'bg-white/10 text-white hover:bg-white/20'"
        >
          {{ equipo.label }}
        </button>
      </div>

      <!-- Contenido -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p class="text-white/70 mt-4 font-medium">Cargando estadísticas...</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Goleadoras -->
        <div class="bg-black border-2 border-primary rounded-lg overflow-hidden">
          <div class="bg-primary-dark px-6 py-4">
            <h2 class="text-2xl md:text-3xl font-400 text-white flex items-center gap-3" style="font-family: 'Collegiate Black', sans-serif;">
              <FireIcon class="w-8 h-8" />
              GOLEADORAS
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-primary-dark border-b-2 border-primary">
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-black">#</th>
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-black">Nombre</th>
                  <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-black">Goles</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(jugadora, index) in goleadorasOrdenadas"
                  :key="jugadora.id"
                  class="border-b border-white/10 hover:bg-primary/5 transition-colors"
                >
                  <td class="px-4 py-3 text-sm md:text-base font-bold text-primary">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm md:text-base font-semibold text-white">
                    {{ jugadora.nombre }} {{ jugadora.apellido }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="bg-primary text-black font-bold px-3 py-1 rounded-full text-sm md:text-base">
                      {{ jugadora.goles || 0 }}
                    </span>
                  </td>
                </tr>
                <tr v-if="goleadorasOrdenadas.length === 0">
                  <td colspan="3" class="px-4 py-6 text-center text-white/70">
                    Sin registros de goles aún
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Asistidoras -->
        <div class="bg-black border-2 border-primary rounded-lg overflow-hidden">
          <div class="bg-primary-dark px-6 py-4">
            <h2 class="text-2xl md:text-3xl font-400 text-white flex items-center gap-3" style="font-family: 'Collegiate Black', sans-serif;">
              <SparklesIcon class="w-8 h-8" />
              ASISTIDORAS
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-primary-dark border-b-2 border-primary">
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-black">#</th>
                  <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-black">Nombre</th>
                  <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-black">Asistencias</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(jugadora, index) in asistidorasOrdenadas"
                  :key="jugadora.id"
                  class="border-b border-white/10 hover:bg-primary/5 transition-colors"
                >
                  <td class="px-4 py-3 text-sm md:text-base font-bold text-primary">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm md:text-base font-semibold text-white">
                    {{ jugadora.nombre }} {{ jugadora.apellido }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="bg-primary text-black font-bold px-3 py-1 rounded-full text-sm md:text-base">
                      {{ jugadora.asistencias || 0 }}
                    </span>
                  </td>
                </tr>
                <tr v-if="asistidorasOrdenadas.length === 0">
                  <td colspan="3" class="px-4 py-6 text-center text-white/70">
                    Sin registros de asistencias aún
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tabla completa de estadísticas -->
        <div class="bg-black border-2 border-primary rounded-lg overflow-hidden">
          <div class="bg-primary-dark px-6 py-4">
            <h2 class="text-2xl md:text-3xl font-400 text-white" style="font-family: 'Collegiate Black', sans-serif;">ESTADÍSTICAS COMPLETAS</h2>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-primary-dark border-b-2 border-primary">
                    <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-black">#</th>
                    <th class="px-4 py-3 text-left text-sm md:text-base font-bold text-black">Nombre</th>
                    <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-black">Goles</th>
                    <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-black">Asistencias</th>
                    <th class="px-4 py-3 text-center text-sm md:text-base font-bold text-black">Participaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(jugadora, index) in estadisticasCompletas"
                    :key="jugadora.id"
                    class="border-b border-white/10 hover:bg-primary/5 transition-colors"
                  >
                    <td class="px-4 py-3 text-sm md:text-base font-bold text-primary">{{ index + 1 }}</td>
                    <td class="px-4 py-3 text-sm md:text-base font-semibold text-white">
                      {{ jugadora.nombre }} {{ jugadora.apellido }}
                    </td>
                    <td class="px-4 py-3 text-center text-sm md:text-base font-semibold text-white">
                      {{ jugadora.goles || 0 }}
                    </td>
                    <td class="px-4 py-3 text-center text-sm md:text-base font-semibold text-white">
                      {{ jugadora.asistencias || 0 }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span class="bg-primary text-black font-bold px-3 py-1 rounded-full text-sm md:text-base">
                        {{ (jugadora.goles || 0) + (jugadora.asistencias || 0) }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="estadisticasCompletas.length === 0">
                    <td colspan="5" class="px-4 py-6 text-center text-white/70">
                      No hay jugadoras registradas en este equipo.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
import { TrophyIcon, FireIcon, SparklesIcon, ChartBarIcon } from '@heroicons/vue/24/solid';

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
    // // console.error('Error cargando estadísticas:', err);
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
