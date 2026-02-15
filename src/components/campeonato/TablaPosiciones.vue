<template>
  <div class="mt-8 bg-black/50 border-2 border-primary/50 rounded-lg overflow-hidden shadow-lg">
    <div class="bg-primary/20 px-4 py-2 border-b border-primary/50">
      <h3 class="text-primary font-bold text-sm text-center flex items-center justify-center gap-2 uppercase tracking-wider">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        Tabla de Posiciones
      </h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-primary/10 border-b border-primary/30">
            <th class="px-2 py-2 text-center text-primary font-bold text-xs uppercase">#</th>
            <th class="px-2 py-2 text-left text-primary font-bold text-xs uppercase">Equipo</th>
            <th class="px-2 py-2 text-center text-primary font-bold text-xs">PJ</th>
            <th class="px-2 py-2 text-center text-primary font-bold text-xs">G</th>
            <th class="px-2 py-2 text-center text-primary font-bold text-xs">P</th>
            <th class="px-2 py-2 text-center text-primary font-bold text-xs">GF</th>
            <th class="px-2 py-2 text-center text-primary font-bold text-xs">GC</th>
            <th class="px-2 py-2 text-center text-primary font-bold text-xs">DG</th>
            <th class="px-2 py-2 text-center text-primary font-bold text-xs">PTS</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(equipo, index) in tabla" 
            :key="equipo.key"
            :class="[
              'border-b border-white/5 hover:bg-primary/5 transition-all border-l-4',
              getRowBackgroundClass(index),
              getBorderClass(equipo)
            ]"
          >
            <!-- Posición -->
            <td class="px-2 py-2 text-center">
              <svg 
                v-if="index < 3" 
                :class="['w-6 h-6 mx-auto', getMedalColor(index)]"
                fill="currentColor" viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span v-else class="text-white/70">{{ index + 1 }}</span>
            </td>
            
            <!-- Equipo -->
            <td class="px-2 py-2">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 bg-white rounded-full p-0.5 shrink-0">
                  <img :src="`/src/assets/${equipo.logo}`" :alt="equipo.nombre" class="w-full h-full object-contain" />
                </div>
                <span class="text-white font-bold text-xs">{{ equipo.nombre }}</span>
              </div>
            </td>
            
            <!-- Estadísticas -->
            <td class="px-2 py-2 text-center text-white/70 font-medium text-xs">{{ equipo.pj }}</td>
            <td class="px-2 py-2 text-center text-primary font-bold text-xs">{{ equipo.pg }}</td>
            <td class="px-2 py-2 text-center text-red-400 font-bold text-xs">{{ equipo.pp }}</td>
            <td class="px-2 py-2 text-center text-white/70 font-medium text-xs">{{ equipo.gf }}</td>
            <td class="px-2 py-2 text-center text-white/70 font-medium text-xs">{{ equipo.gc }}</td>
            <td :class="['px-2 py-2 text-center font-bold text-xs', equipo.dg >= 0 ? 'text-primary' : 'text-red-400']">
              {{ equipo.dg >= 0 ? '+' : '' }}{{ equipo.dg }}
            </td>
            <td class="px-2 py-2 text-center text-primary font-bold text-base">{{ equipo.pts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Leyenda -->
    <div class="bg-primary/10 px-3 py-1.5 border-t border-primary/30">
      <p class="text-white/60 text-xs text-center leading-relaxed">
        <span class="font-semibold text-white">PJ:</span> Partidos Jugados • 
        <span class="font-semibold text-white">G:</span> Ganados • 
        <span class="font-semibold text-white">P:</span> Perdidos • 
        <span class="font-semibold text-white">GF:</span> Goles a Favor • 
        <span class="font-semibold text-white">GC:</span> Goles en Contra • 
        <span class="font-semibold text-white">DG:</span> Diferencia de Goles • 
        <span class="font-semibold text-white">PTS:</span> Puntos
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabla: {
    type: Array,
    required: true
  }
});

const getRowBackgroundClass = (index) => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400/10 to-transparent';
  if (index === 1) return 'bg-gradient-to-r from-gray-300/10 to-transparent';
  if (index === 2) return 'bg-gradient-to-r from-orange-400/10 to-transparent';
  return '';
};

const getMedalColor = (index) => {
  if (index === 0) return 'text-yellow-400';
  if (index === 1) return 'text-gray-300';
  if (index === 2) return 'text-orange-400';
  return '';
};

const getBorderClass = (equipo) => {
  if (equipo.color === 'cyan') return 'border-l-cyan-400';
  if (equipo.color === 'gray') return 'border-l-gray-300';
  if (equipo.color === 'red') return 'border-l-red-400';
  return 'border-l-yellow-400';
};
</script>
