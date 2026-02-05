<template>
  <div class="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-2" style="font-family: 'Gobold High', sans-serif;">COMPETENCIAS</h1>
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="h-1 w-12 bg-primary rounded-full"></div>
          <p class="text-primary font-bold text-lg tracking-widest flex items-center gap-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            CAMPEONAS ORO SERIE AB+
          </p>
          <div class="h-1 w-12 bg-primary rounded-full"></div>
        </div>
        <p class="text-white/70 text-sm">LigaDobleve Summer Cup 2026 - Vikingas Ascenso - Enero 2026</p>
        
        <!-- Botón a Estadísticas -->
        <div class="mt-6">
          <router-link
            to="/estadisticas"
            class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-xl"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Ver Estadísticas del Equipo
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <!-- <div v-if="loading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <p class="text-white/70 mt-4 font-medium">Cargando tabla de posiciones...</p>
      </div>

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

      <div v-else class="bg-black  border-2 border-primary rounded-lg shadow-2xl overflow-hidden">
        <div class="bg-primary-dark px-6 py-3 border-b-2 border-primary">
          <p class="text-black font-bold text-sm">
            Última actualización: {{ formatDate(lastUpdate) }}
          </p>
        </div>

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
                <td class="px-4 py-4 text-center font-bold">
                  <span v-if="index === 0" class="text-2xl">🥇</span>
                  <span v-else-if="index === 1" class="text-2xl">🥈</span>
                  <span v-else-if="index === 2" class="text-2xl">🥉</span>
                  <span v-else class="text-primary font-bold text-lg">{{ equipo.posicion }}</span>
                </td>

                <td class="px-4 py-4 font-bold text-white">
                  {{ equipo.equipo }}
                  <span v-if="equipo.equipo === 'CD Vikingas'" class="ml-2 text-xs bg-primary text-black px-2 py-1 rounded font-bold">VIKINGAS</span>
                </td>

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
      </div> -->

      <!-- Resultados del Torneo -->
      <div class="mt-12 bg-black border-2 border-primary rounded-lg p-8">
        <h2 class="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3" style="font-family: 'Collegiate Black', sans-serif;">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h8v8H3V3m10 0h8v8h-8V3M3 13h8v8H3v-8m13.33 0L13 16l-1.33-3 3-1.33L16 9l1.33 3 3 1.33-3 1.34L16 17l-1.33-3-3 1.33 3-1.33Z"/>
          </svg>
          RESULTADOS LIGA DOBLEVE VERANO 2026
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Fase de Grupos -->
          <div>
            <h3 class="text-primary font-bold text-lg mb-4 border-b-2 border-primary pb-2">FASE DE GRUPOS</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Vieja Escuela</span>
                <span class="text-red-400 font-bold">1 - 5</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs De Cero</span>
                <span class="text-red-400 font-bold">3 - 4</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Panteras</span>
                <span class="text-red-400 font-bold">2 - 4</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Florida</span>
                <span class="text-red-400 font-bold">1 - 11</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Clever</span>
                <span class="text-red-400 font-bold">3 - 5</span>
              </div>
              <div class="flex justify-between items-center bg-white/5 p-3 rounded">
                <span class="text-white font-medium">Vikingas vs Firegol</span>
                <span class="text-red-400 font-bold">1 - 4</span>
              </div>
              <div class="flex justify-between items-center bg-primary/20 border-2 border-primary p-3 rounded">
                <span class="text-white font-bold">Vikingas vs Leyendas</span>
                <span class="text-primary font-bold">5 - 2</span>
              </div>
            </div>
          </div>

          <!-- Playoffs/Final -->
          <div>
            <h3 class="text-primary font-bold text-lg mb-4 border-b-2 border-primary pb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              PLAYOFFS - FINAL
            </h3>
            <div class="space-y-3">
              <div class="bg-primary/20 border-2 border-primary p-3 rounded">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-primary text-xs font-bold uppercase">Semifinal</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-white font-bold">Vikingas vs Clever</span>
                  <span class="text-primary font-bold text-xl">7 - 2</span>
                </div>
              </div>
              
              <div class="bg-primary/20 border-2 border-primary p-3 rounded">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-primary text-xs font-bold uppercase flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    Final
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-white font-bold">Vikingas vs Firegol</span>
                  <span class="text-primary font-bold text-xl">4 - 2</span>
                </div>
              </div>
              
              <div class="mt-6 bg-primary-dark p-6 rounded-lg text-center">
                <p class="text-black text-2xl font-black mb-2 flex items-center justify-center gap-2">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  CAMPEONAS
                </p>
                <p class="text-black font-bold text-sm">Serie AB+ Liga de Verano</p>
                <p class="text-black/70 text-xs mt-2">Vikingas Ascenso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de la liga -->
      <div class="mt-12 bg-primary-dark rounded-lg p-8 border-2 border-primary">
        <h2 class="text-3xl font-bold text-black mb-6 flex items-center gap-3" style="font-family: 'Collegiate Black', sans-serif;">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          CAMPEONAS SERIE AB+
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-black font-bold text-lg mb-3">LIGADOBLEVE SUMMER CUP 2026</h3>
            <p class="text-black/80 text-sm mb-4 leading-relaxed">
              ¡CD Vikingas - categoría Vikingas Ascenso - es campeona de la Serie Oro AB+ Liga de Verano! El equipo demostró una gran recuperación tras una fase de grupos complicada, logrando victorias contundentes en los playoffs para coronarse campeonas.
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
            <h3 class="text-black font-bold text-lg mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4m0-2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 11c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
              </svg>
              LOGROS DEL TORNEO
            </h3>
            <ul class="text-black/80 text-sm space-y-2">
              <li class="font-bold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Campeonas Serie Oro AB+ Liga de Verano
              </li>
              <li class="font-bold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Victoria 7-2 en semifinal vs Clever
              </li>
              <li class="font-bold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Victoria 4-2 en final vs Firegol
              </li>
              <li class="font-semibold text-black flex items-center gap-2">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.71,4.14C12.76,4.3 12.79,4.47 12.8,4.64C12.81,4.85 12.8,5.05 12.76,5.24C12.72,5.43 12.65,5.61 12.55,5.78L10.55,9.13C10.32,9.5 9.97,9.78 9.56,9.92C9.15,10.06 8.71,10.06 8.3,9.91L4.5,8.45C4.3,8.38 4.11,8.29 3.94,8.18C3.77,8.07 3.61,7.93 3.48,7.77C3.35,7.61 3.24,7.43 3.16,7.23C3.08,7.04 3.03,6.83 3.01,6.62C2.99,6.41 3,6.19 3.04,5.98C3.08,5.77 3.16,5.56 3.27,5.37C3.38,5.18 3.52,5.01 3.68,4.87C3.85,4.73 4.03,4.61 4.23,4.53L8.03,3.07C8.45,2.92 8.89,2.92 9.3,3.06C9.71,3.2 10.06,3.48 10.29,3.85L12.29,7.2C12.47,7.5 12.57,7.84 12.6,8.19C12.63,8.54 12.57,8.89 12.45,9.21L11.6,9.56L12.71,4.14M20.77,5.98C20.81,6.19 20.82,6.41 20.8,6.62C20.78,6.83 20.73,7.04 20.65,7.23C20.57,7.43 20.46,7.61 20.33,7.77C20.2,7.93 20.04,8.07 19.87,8.18C19.7,8.29 19.51,8.38 19.31,8.45L15.51,9.91C15.1,10.06 14.66,10.06 14.25,9.92C13.84,9.78 13.49,9.5 13.26,9.13L11.26,5.78C11.16,5.61 11.09,5.43 11.05,5.24C11.01,5.05 11,4.85 11.01,4.64C11.02,4.47 11.05,4.3 11.1,4.14L12.21,9.56L11.36,9.21C11.24,8.89 11.18,8.54 11.21,8.19C11.24,7.84 11.34,7.5 11.52,7.2L13.52,3.85C13.75,3.48 14.1,3.2 14.51,3.06C14.92,2.92 15.36,2.92 15.78,3.07L19.58,4.53C19.78,4.61 19.96,4.73 20.13,4.87C20.29,5.01 20.43,5.18 20.54,5.37C20.65,5.56 20.73,5.77 20.77,5.98M17.64,14C17.64,15.96 16.62,17.76 15,18.85V21.97H9V18.85C7.38,17.76 6.36,15.96 6.36,14H17.64Z"/>
                </svg>
                Gran remontada en playoffs
              </li>
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
