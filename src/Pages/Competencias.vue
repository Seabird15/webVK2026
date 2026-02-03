<template>
  <div class="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-2" style="font-family: 'Gobold High', sans-serif;">COMPETENCIAS</h1>
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="h-1 w-12 bg-primary rounded-full"></div>
          <p class="text-primary font-bold text-lg tracking-widest">SERIE AB+</p>
          <div class="h-1 w-12 bg-primary rounded-full"></div>
        </div>
        <p class="text-white/70 text-sm">LigaDoble Summer Cup 2026</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p class="text-white/70 mt-4 font-medium">Cargando tabla de posiciones...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-900/20 border border-primary text-primary px-6 py-4 rounded-lg mb-6">
        <h3 class="font-bold mb-2 text-white">Error al cargar los datos</h3>
        <p class="text-sm mb-4">{{ error }}</p>
        <button 
          @click="fetchTabla"
          class="bg-primary hover:bg-primary/80 text-black px-4 py-2 rounded font-bold transition cursor-pointer"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Table -->
      <div v-else class="bg-black border-2 border-primary rounded-lg shadow-2xl overflow-hidden">
        <!-- Last Update -->
        <div class="bg-primary-dark px-6 py-3 border-b-2 border-primary">
          <p class="text-black font-bold text-sm">
            Última actualización: {{ formatDate(lastUpdate) }}
          </p>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-primary-dark border-b-2 border-primary">
                <th class="px-4 py-4 text-left text-black font-bold">#</th>
                <th class="px-4 py-4 text-left text-black font-bold">EQUIPO</th>
                <th class="px-4 py-4 text-center text-black font-bold">PJ</th>
                <th class="px-4 py-4 text-center text-black font-bold">PG</th>
                <th class="px-4 py-4 text-center text-black font-bold">PE</th>
                <th class="px-4 py-4 text-center text-black font-bold">PP</th>
                <th class="px-4 py-4 text-center text-black font-bold">DG</th>
                <th class="px-4 py-4 text-center text-black font-bold">Pts</th>
                <th class="px-4 py-4 text-center text-black font-bold">GF</th>
                <th class="px-4 py-4 text-center text-black font-bold">GC</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(equipo, index) in tabla" 
                :key="index"
                :class="[
                  'border-b border-white/10 hover:bg-primary/5 transition',
                  index === 0 ? 'bg-primary/10' : index === 1 ? 'bg-primary/5' : ''
                ]"
              >
                <!-- Posición con medalla -->
                <td class="px-4 py-4 text-center font-bold">
                  <span v-if="index === 0" class="text-2xl">🥇</span>
                  <span v-else-if="index === 1" class="text-2xl">🥈</span>
                  <span v-else-if="index === 2" class="text-2xl">🥉</span>
                  <span v-else class="text-primary font-bold text-lg">{{ equipo.posicion }}</span>
                </td>

                <!-- Equipo -->
                <td class="px-4 py-4 font-bold text-white">
                  {{ equipo.equipo }}
                  <span v-if="equipo.equipo === 'CD Vikingas'" class="ml-2 text-xs bg-primary text-black px-2 py-1 rounded font-bold">VIKINGAS</span>
                </td>

                <!-- Estadísticas -->
                <td class="px-4 py-4 text-center text-white/70 font-medium">{{ equipo.pj }}</td>
                <td class="px-4 py-4 text-center text-primary font-bold">{{ equipo.pg }}</td>
                <td class="px-4 py-4 text-center text-yellow-400 font-bold">{{ equipo.pe }}</td>
                <td class="px-4 py-4 text-center text-red-400 font-bold">{{ equipo.pp }}</td>
                <td class="px-4 py-4 text-center font-bold" :class="parseInt(equipo.dg) >= 0 ? 'text-primary' : 'text-red-400'">
                  {{ equipo.dg > 0 ? '+' : '' }}{{ equipo.dg }}
                </td>
                <td class="px-4 py-4 text-center text-primary font-bold text-lg">{{ equipo.ptos }}</td>
                <td class="px-4 py-4 text-center text-white/70 font-medium">{{ equipo.gf }}</td>
                <td class="px-4 py-4 text-center text-white/70 font-medium">{{ equipo.gc }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legenda -->
        <div class="bg-primary-dark px-6 py-4 border-t-2 border-primary">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
            <div class="text-black font-bold"><span class="font-black">PJ:</span> Part. Jugados</div>
            <div class="text-black font-bold"><span class="font-black">PG:</span> Part. Ganados</div>
            <div class="text-black font-bold"><span class="font-black">PE:</span> Part. Empatados</div>
            <div class="text-black font-bold"><span class="font-black">PP:</span> Part. Perdidos</div>
            <div class="text-black font-bold"><span class="font-black">DG:</span> Dif. Goles</div>
            <div class="text-black font-bold"><span class="font-black">Pts:</span> Puntos</div>
            <div class="text-black font-bold"><span class="font-black">GF:</span> Goles a Favor</div>
            <div class="text-black font-bold"><span class="font-black">GC:</span> Goles en Contra</div>
          </div>
        </div>
      </div>

      <!-- Información de la liga -->
      <div class="mt-12 bg-primary-dark rounded-lg p-8 border-2 border-primary">
        <h2 class="text-3xl font-bold text-black mb-6" style="font-family: 'Collegiate Black', sans-serif;">🏆 SOBRE LA COMPETENCIA</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-black font-bold text-lg mb-3">LIGADOUBLE SUMMER CUP 2026</h3>
            <p class="text-black/80 text-sm mb-4 leading-relaxed">
              Torneo de fútbol femenino organizado por Trotamundos. CD Vikingas participa en la Serie AB+, compitiendo contra los mejores equipos de la región.
            </p>
            <a 
              href="https://trotamundos.cl/index.php/ligadobleve-summer-cup/" 
              target="_blank" 
              class="inline-block bg-black hover:bg-black/80 text-primary px-4 py-2 rounded font-bold transition text-sm"
            >
              Ver página oficial →
            </a>
          </div>
          <div>
            <h3 class="text-black font-bold text-lg mb-3">📅 PRÓXIMAS JORNADAS</h3>
            <ul class="text-black/80 text-sm space-y-2">
              <li class="font-semibold text-black">• Jornada 3: martes 13 enero</li>
              <li class="font-semibold text-black">• Jornada 4: jueves 15 enero</li>
              <li class="font-semibold text-black">• Jornada 5: martes 20 enero</li>
              <li class="font-semibold text-black">• Gran Final: martes 3 febrero</li>
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
    // En desarrollo, usar localhost
    // En producción, usar el mismo dominio que la app
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDev ? 'http://localhost:3001' : window.location.origin;
    
    console.log('API URL:', apiUrl);
    
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
