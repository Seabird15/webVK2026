<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-2">Competencias</h1>
        <p class="text-gray-300">Tabla de posiciones - SERIE AB+</p>
        <p class="text-sm text-gray-400 mt-2">LigaDoble Summer Cup 2026</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        <p class="text-gray-300 mt-4">Cargando tabla de posiciones...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/50 border border-red-500 text-red-100 px-6 py-4 rounded-lg mb-6">
        <h3 class="font-semibold mb-2">Error al cargar los datos</h3>
        <p class="text-sm mb-4">{{ error }}</p>
        <button 
          @click="fetchTabla"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Table -->
      <div v-else class="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700">
        <!-- Last Update -->
        <div class="bg-slate-700 px-6 py-3 border-b border-slate-600">
          <p class="text-sm text-gray-300">
            <span class="font-semibold">Última actualización:</span>
            {{ formatDate(lastUpdate) }}
          </p>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-700 border-b border-slate-600">
                <th class="px-4 py-3 text-left text-white font-semibold">#</th>
                <th class="px-4 py-3 text-left text-white font-semibold">Equipo</th>
                <th class="px-4 py-3 text-center text-white font-semibold">PJ</th>
                <th class="px-4 py-3 text-center text-white font-semibold">PG</th>
                <th class="px-4 py-3 text-center text-white font-semibold">PE</th>
                <th class="px-4 py-3 text-center text-white font-semibold">PP</th>
                <th class="px-4 py-3 text-center text-white font-semibold">DG</th>
                <th class="px-4 py-3 text-center text-white font-semibold">GF</th>
                <th class="px-4 py-3 text-center text-white font-semibold">GC</th>
                <th class="px-4 py-3 text-center text-white font-semibold">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(equipo, index) in tabla" 
                :key="index"
                :class="[
                  'border-b border-slate-600 hover:bg-slate-700 transition',
                  index === 0 ? 'bg-yellow-900/20' : index === 1 ? 'bg-gray-600/20' : index === 2 ? 'bg-orange-900/20' : ''
                ]"
              >
                <!-- Posición con medalla -->
                <td class="px-4 py-3 text-center font-bold">
                  <span v-if="index === 0" class="text-yellow-400">🥇</span>
                  <span v-else-if="index === 1" class="text-gray-300">🥈</span>
                  <span v-else-if="index === 2" class="text-orange-400">🥉</span>
                  <span v-else class="text-white">{{ equipo.posicion }}</span>
                </td>

                <!-- Equipo -->
                <td class="px-4 py-3 font-semibold text-white">
                  {{ equipo.equipo }}
                  <span v-if="equipo.equipo === 'CD Vikingas'" class="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">Tu equipo</span>
                </td>

                <!-- Estadísticas -->
                <td class="px-4 py-3 text-center text-gray-300">{{ equipo.pj }}</td>
                <td class="px-4 py-3 text-center text-green-400 font-semibold">{{ equipo.pg }}</td>
                <td class="px-4 py-3 text-center text-blue-400 font-semibold">{{ equipo.pe }}</td>
                <td class="px-4 py-3 text-center text-red-400 font-semibold">{{ equipo.pp }}</td>
                <td class="px-4 py-3 text-center" :class="parseInt(equipo.dg) >= 0 ? 'text-green-400' : 'text-red-400'">
                  {{ equipo.dg > 0 ? '+' : '' }}{{ equipo.dg }}
                </td>
                <td class="px-4 py-3 text-center text-gray-300">{{ equipo.gf }}</td>
                <td class="px-4 py-3 text-center text-gray-300">{{ equipo.gc }}</td>
                <td class="px-4 py-3 text-center font-bold text-white">{{ equipo.ptos }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legenda -->
        <div class="bg-slate-700 px-6 py-4 border-t border-slate-600">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs text-gray-300">
            <div><span class="font-semibold">PJ:</span> Partidos Jugados</div>
            <div><span class="font-semibold">PG:</span> Partidos Ganados</div>
            <div><span class="font-semibold">PE:</span> Partidos Empatados</div>
            <div><span class="font-semibold">PP:</span> Partidos Perdidos</div>
            <div><span class="font-semibold">DG:</span> Diferencia de Goles</div>
            <div><span class="font-semibold">GF:</span> Goles a Favor</div>
            <div><span class="font-semibold">GC:</span> Goles en Contra</div>
            <div><span class="font-semibold">Pts:</span> Puntos</div>
          </div>
        </div>
      </div>

      <!-- Información de la liga -->
      <div class="mt-12 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 class="text-xl font-bold text-white mb-4">Información de la Liga</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-white font-semibold mb-3">🏆 LigaDoble Summer Cup 2026</h3>
            <p class="text-gray-300 text-sm mb-4">
              Torneo de fútbol femenino organizado por Trotamundos. Participa CD Vikingas en la Serie AB+.
            </p>
            <a 
              href="https://trotamundos.cl/index.php/ligadobleve-summer-cup/" 
              target="_blank" 
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
            >
              Ver página oficial ↗
            </a>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-3">📅 Calendario</h3>
            <ul class="text-gray-300 text-sm space-y-2">
              <li>• Jornada 3: martes 12 enero</li>
              <li>• Jornada 4: jueves 14 enero</li>
              <li>• Jornada 5: martes 19 enero</li>
              <li>• Gran Final: martes 3 febrero</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tabla = ref([]);
const loading = ref(true);
const error = ref(null);
const lastUpdate = ref(null);

const fetchTabla = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Usar la URL desde variables de entorno
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/competencias`);
    const data = await response.json();

    if (data.success) {
      tabla.value = data.data;
      lastUpdate.value = data.timestamp;
    } else {
      error.value = data.message || 'Error al obtener los datos de la tabla';
    }
  } catch (err) {
    console.error('Error:', err);
    error.value = 'No se pudo conectar al servidor. Por favor intenta más tarde.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchTabla();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
