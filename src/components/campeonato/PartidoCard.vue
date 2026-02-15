<template>
  <div class="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 border-2 border-primary rounded-lg p-3 sm:p-6">
    <!-- Header del partido -->
    <div class="flex items-center justify-between mb-3 sm:mb-4">
      <div class="flex items-center gap-1 sm:gap-2 text-primary">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
        </svg>
        <span class="font-bold text-xs sm:text-sm">{{ partido.horario }}</span>
      </div>
      
      <div class="flex items-center gap-2">
        <span :class="['text-xs font-bold border px-2 sm:px-3 py-1 rounded-full', estadoBadge.class]">
          {{ estadoBadge.text }}
        </span>
        
        <!-- Botón de goleadoras (solo admin) -->
        <button
          v-if="isAdmin && !editando"
          @click="$emit('editar-goleadoras')"
          class="bg-primary hover:bg-primary/80 text-black px-2 py-1 rounded text-xs font-bold transition"
        >
          ⚽ Goleadoras
        </button>
      </div>
    </div>
    
    <!-- Vista normal -->
    <div v-if="!editando" class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
      <!-- Equipo Local -->
      <div class="flex items-center gap-2 sm:gap-3 flex-1">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-2 shrink-0">
          <img :src="equipoLocalData.logoSrc" :alt="equipoLocalData.nombre" class="w-full h-full object-contain" />
        </div>
        <span :class="['font-bold text-sm sm:text-lg', esGanador('local') ? 'text-primary' : 'text-white/70']">
          {{ equipoLocalData.nombre }}
        </span>
      </div>
      
      <!-- Marcador -->
      <div class="flex items-center gap-3 sm:gap-4">
        <span :class="['font-black text-2xl sm:text-3xl', esGanador('local') ? 'text-primary' : 'text-white/70']">
          {{ partido.golesLocal }}
        </span>
        <span class="text-primary/50 font-bold text-lg">-</span>
        <span :class="['font-black text-2xl sm:text-3xl', esGanador('visita') ? 'text-primary' : 'text-white/70']">
          {{ partido.golesVisita }}
        </span>
      </div>
      
      <!-- Equipo Visitante -->
      <div class="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
        <span :class="['font-bold text-sm sm:text-lg text-right', esGanador('visita') ? 'text-primary' : 'text-white/70']">
          {{ equipoVisitaData.nombre }}
        </span>
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-2 shrink-0">
          <img :src="equipoVisitaData.logoSrc" :alt="equipoVisitaData.nombre" class="w-full h-full object-contain" />
        </div>
      </div>
    </div>
    
    <!-- Vista de edición (slot) -->
    <div v-if="editando">
      <slot name="edicion"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useEquipoConfig } from '../../composables/useEquipoConfig';

const props = defineProps({
  partido: {
    type: Object,
    required: true
  },
  editando: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

defineEmits(['editar-goleadoras']);

const { getEquipoData, getEquipoLogo } = useEquipoConfig();

const equipoLocalData = computed(() => {
  const data = getEquipoData(props.partido.equipoLocal);
  return {
    ...data,
    logoSrc: getEquipoLogo(props.partido.equipoLocal)
  };
});

const equipoVisitaData = computed(() => {
  const data = getEquipoData(props.partido.equipoVisita);
  return {
    ...data,
    logoSrc: getEquipoLogo(props.partido.equipoVisita)
  };
});

const esGanador = (tipo) => {
  if (tipo === 'local') {
    return props.partido.golesLocal > props.partido.golesVisita;
  }
  return props.partido.golesVisita > props.partido.golesLocal;
};

const estadoBadge = computed(() => {
  if (props.partido.estado === 'FINALIZADO') {
    return { text: '✓ FINALIZADO', class: 'bg-green-500/20 text-green-400 border-green-400' };
  } else if (props.partido.estado === 'EN_CURSO') {
    return { text: '⚽ EN CURSO', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-400' };
  }
  return { text: '⏱ PRÓXIMAMENTE', class: 'bg-blue-500/20 text-blue-400 border-blue-400' };
});
</script>
