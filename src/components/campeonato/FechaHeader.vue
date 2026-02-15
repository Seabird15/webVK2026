<template>
  <div>
    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center flex items-center justify-center gap-2 sm:gap-3" style="font-family: 'Collegiate Black', sans-serif;">
      <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 11H7v2h2v-2m4 0h-2v2h2v-2m4 0h-2v2h2v-2m2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V9h14v11z"/>
      </svg>
      <span class="hidden sm:inline">FECHA {{ numeroFecha }} - {{ getFechaTexto(numeroFecha) }}</span>
      <span class="sm:hidden">FECHA {{ numeroFecha }}</span>
    </h2>
    
    <!-- Estado de la fecha -->
    <div class="text-center mb-4">
      <span :class="['inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold', estadoBadge.class]">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <component :is="estadoBadge.icon" />
        </svg>
        {{ estadoBadge.text }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  numeroFecha: {
    type: [String, Number],
    required: true
  },
  partidos: {
    type: Array,
    required: true
  }
});

const getFechaTexto = (numero) => {
  return numero == 1 ? 'SÁBADO 7 DE FEBRERO' : 'SÁBADO 14 DE FEBRERO';
};

const estadoBadge = computed(() => {
  if (props.partidos.every(p => p.estado === 'FINALIZADO')) {
    return {
      text: 'FECHA COMPLETADA',
      class: 'bg-green-500/20 text-green-400 border border-green-400',
      icon: 'path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"'
    };
  } else if (props.partidos.some(p => p.estado === 'EN_CURSO')) {
    return {
      text: 'EN CURSO',
      class: 'bg-yellow-500/20 text-yellow-400 border border-yellow-400 animate-pulse',
      icon: 'circle cx="12" cy="12" r="8"'
    };
  }
  return {
    text: 'PRÓXIMAMENTE',
    class: 'bg-blue-500/20 text-blue-400 border border-blue-400',
    icon: 'path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"'
  };
});
</script>
