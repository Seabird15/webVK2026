<template>
  <div class="bg-black border-2 border-primary rounded-lg overflow-hidden">
    <button
      @click="$emit('toggle')"
      class="w-full px-6 py-3 bg-primary-dark flex items-center justify-between hover:bg-primary transition-colors cursor-pointer"
    >
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        <div class="text-left">
          <h2 class="text-xl font-400 tracking-wider text-white" style="font-family: 'Collegiate Black', sans-serif;">
            TABLA DE GOLEADORAS
          </h2>
          <p class="text-black/70 text-xs">Rankings individuales por goles anotados</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-black font-bold text-xs bg-black/20 px-3 py-1 rounded-full">
          {{ goleadoras.length }} {{ goleadoras.length === 1 ? 'goleadora' : 'goleadoras' }}
        </span>
        <svg 
          class="w-5 h-5 text-black transition-transform duration-300"
          :class="mostrar ? 'rotate-180' : ''"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </button>

    <div v-show="mostrar" class="p-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <!-- Última actualización -->
      <div class="mb-4 text-center">
        <p class="text-white/60 text-xs">
          Última actualización: <span class="text-primary font-bold">{{ lastUpdate }}</span>
        </p>
      </div>

      <!-- Sin goleadoras -->
      <div v-if="goleadoras.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-white/20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
        <p class="text-white/60 text-lg font-medium">Aún no hay goles registrados</p>
        <p class="text-white/40 text-sm mt-2">Los goles se mostrarán aquí una vez que comience el torneo</p>
      </div>

      <!-- Tabla -->
      <div v-else class="bg-black/50 rounded-lg border border-primary/30 overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-primary/10 border-b border-primary/30">
                <th class="px-3 py-2 text-center text-primary font-bold text-xs uppercase tracking-wider">#</th>
                <th class="px-3 py-2 text-left text-primary font-bold text-xs uppercase tracking-wider">Jugadora</th>
                <th class="px-3 py-2 text-left text-primary font-bold text-xs uppercase tracking-wider">Equipo</th>
                <th class="px-3 py-2 text-center text-primary font-bold text-xs uppercase tracking-wider">Goles</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(jugadora, index) in goleadoras" 
                :key="index"
                :class="getRowClass(index)"
                class="border-b border-white/5 transition-all duration-200"
              >
                <td class="px-3 py-3 text-center">
                  <!-- Medallas Top 3 -->
                  <div v-if="index < 3" class="flex items-center justify-center">
                    <svg :class="['w-7 h-7', getMedalColor(index)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <span v-else class="text-white/60 text-sm font-semibold">{{ index + 1 }}</span>
                </td>
                
                <td class="px-3 py-3">
                  <div class="flex items-center gap-2">
                    <span :class="['font-bold text-sm', getNameColor(index)]">
                      {{ jugadora.nombre }}
                    </span>
                    <span v-if="jugadora.capitana" class="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">C</span>
                  </div>
                </td>
                
                <td class="px-3 py-3">
                  <span :class="['text-xs font-semibold whitespace-nowrap px-2 py-1 rounded-full', getTeamBadgeClass(jugadora.color)]">
                    {{ jugadora.equipo }}
                  </span>
                </td>
                
                <td class="px-3 py-3 text-center">
                  <div class="inline-flex items-center gap-1">
                    <svg :class="['w-4 h-4', getGoalIconColor(index)]" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span :class="['font-black text-lg', getGoalTextColor(index)]">
                      {{ jugadora.goles }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  goleadoras: {
    type: Array,
    required: true
  },
  mostrar: {
    type: Boolean,
    default: false
  },
  lastUpdate: {
    type: String,
    default: 'No disponible'
  }
});

defineEmits(['toggle']);

const getRowClass = (index) => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400/15 via-yellow-500/5 to-transparent hover:from-yellow-400/20 border-l-4 border-l-yellow-400';
  if (index === 1) return 'bg-gradient-to-r from-gray-300/15 via-gray-400/5 to-transparent hover:from-gray-300/20 border-l-4 border-l-gray-300';
  if (index === 2) return 'bg-gradient-to-r from-orange-400/15 via-orange-500/5 to-transparent hover:from-orange-400/20 border-l-4 border-l-orange-400';
  return 'hover:bg-primary/5';
};

const getMedalColor = (index) => {
  if (index === 0) return 'text-yellow-400';
  if (index === 1) return 'text-gray-300';
  if (index === 2) return 'text-orange-400';
  return '';
};

const getNameColor = (index) => {
  if (index === 0) return 'text-yellow-400';
  if (index === 1) return 'text-gray-300';
  if (index === 2) return 'text-orange-300';
  return 'text-white';
};

const getTeamBadgeClass = (color) => {
  if (color === 'cyan') return 'text-cyan-300 bg-cyan-400/15 border border-cyan-400/30';
  if (color === 'gray') return 'text-gray-300 bg-gray-400/15 border border-gray-400/30';
  if (color === 'red') return 'text-red-300 bg-red-400/15 border border-red-400/30';
  return '';
};

const getGoalIconColor = (index) => {
  if (index === 0) return 'text-yellow-400';
  if (index === 1) return 'text-gray-300';
  if (index === 2) return 'text-orange-300';
  return 'text-primary';
};

const getGoalTextColor = (index) => {
  if (index === 0) return 'text-yellow-400';
  if (index === 1) return 'text-gray-300';
  if (index === 2) return 'text-orange-300';
  return 'text-primary';
};
</script>
