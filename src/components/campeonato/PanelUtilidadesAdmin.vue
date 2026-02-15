<template>
  <div class="bg-black/50 border-2 border-yellow-500 rounded-lg p-6">
    <div class="flex items-center gap-3 mb-4">
      <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 1.5l8 3.5v9c0 4.86-3.36 9.28-8 10.5-4.64-1.22-8-5.64-8-10.5V7l8-3.5zm-1 5.5v2h-2v2h2v2h2v-2h2v-2h-2V9h-2z"/>
      </svg>
      <h3 class="text-yellow-500 font-bold text-lg">UTILIDADES DE ADMINISTRADOR</h3>
    </div>

    <!-- Inicializar Fecha 2 -->
    <div class="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 mb-4">
      <h4 class="text-white font-bold mb-2">Fecha 2 - 14 de Febrero</h4>
      <p class="text-white/70 text-sm mb-3">
        Inicializa los 3 partidos de la Fecha 2 (hoy). Solo necesitas hacer esto una vez.
      </p>
      
      <div v-if="resultado" :class="['p-3 rounded mb-3 text-sm', resultado.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400']">
        {{ resultado.message }}
      </div>

      <button
        @click="ejecutarInicializacion"
        :disabled="ejecutando"
        class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg v-if="ejecutando" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>⚡</span>
        {{ ejecutando ? 'Inicializando...' : 'Inicializar Partidos Fecha 2' }}
      </button>
    </div>

    <!-- Info sobre los partidos -->
    <div class="bg-white/5 rounded p-4">
      <h4 class="text-white font-bold mb-2 text-sm">📋 Partidos de la Fecha 2:</h4>
      <ul class="text-white/70 text-xs space-y-1">
        <li>• 20:00 - 20:35: Siempre al Palo FC vs Las Verserkers</li>
        <li>• 20:40 - 21:15: Inter Nadas vs Las Verserkers</li>
        <li>• 21:20 - 21:55: Inter Nadas vs Siempre al Palo FC</li>
      </ul>
      <p class="text-white/50 text-xs mt-3">
        Una vez inicializados, podrás gestionarlos en tiempo real desde el panel principal.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { inicializarPartidosFecha2 } from '../../scripts/inicializarPartidosFecha2';

const ejecutando = ref(false);
const resultado = ref(null);

const ejecutarInicializacion = async () => {
  ejecutando.value = true;
  resultado.value = null;
  
  try {
    const res = await inicializarPartidosFecha2();
    resultado.value = res;
    
    if (res.success) {
      // Recargar la página después de 2 segundos para ver los cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  } catch (error) {
    resultado.value = {
      success: false,
      message: `Error: ${error.message}`
    };
  } finally {
    ejecutando.value = false;
  }
};
</script>
