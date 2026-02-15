<template>
  <div class="mb-8 bg-black border-2 border-primary rounded-lg overflow-hidden">
    <button
      @click="$emit('toggle')"
      class="w-full px-6 py-4 bg-primary-dark flex items-center justify-between hover:bg-primary transition-colors cursor-pointer"
    >
      <div class="flex items-center gap-3">
        <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        <div class="text-left">
          <h2 class="text-2xl font400 tracking-wider text-white" style="font-family: 'Collegiate Black', sans-serif;">
            LIGADOBLEVE SUMMER CUP 2026
          </h2>
          <p class="text-black/70 text-sm">🥇 Campeonas Serie AB+ • Vikingas Ascenso • Enero 2026</p>
        </div>
      </div>
      <svg 
        :class="['w-6 h-6 text-black transition-transform duration-300', expandida ? 'rotate-180' : '']"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <div v-show="expandida" class="p-8">
      <!-- Resultados del Torneo -->
      <div class="bg-black border-2 border-primary rounded-lg p-8">
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
              <ResultadoPartido
                v-for="(resultado, index) in resultadosFaseGrupos"
                :key="index"
                :partido="resultado.partido"
                :resultado="resultado.goles"
                :ganado="resultado.ganado"
              />
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
      <div class="mt-8 bg-primary-dark rounded-lg p-8 border-2 border-primary">
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
import { ref } from 'vue';

defineProps({
  expandida: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle']);

const resultadosFaseGrupos = [
  { partido: 'Vikingas vs Vieja Escuela', goles: '1 - 5', ganado: false },
  { partido: 'Vikingas vs De Cero', goles: '3 - 4', ganado: false },
  { partido: 'Vikingas vs Panteras', goles: '2 - 4', ganado: false },
  { partido: 'Vikingas vs Florida', goles: '1 - 11', ganado: false },
  { partido: 'Vikingas vs Clever', goles: '3 - 5', ganado: false },
  { partido: 'Vikingas vs Firegol', goles: '1 - 4', ganado: false },
  { partido: 'Vikingas vs Leyendas', goles: '5 - 2', ganado: true }
];
</script>

<style scoped>
/* Componente auxiliar inline para resultados */
</style>
