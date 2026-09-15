<template>
  <section v-if="equipos.length > 1" class="mb-0 w-full max-w-full overflow-hidden sm:mb-5 md:mb-8">
    <div class="rounded-2xl rounded-b-none border border-white/10 border-b-0 bg-white/6 px-3 py-2.5 backdrop-blur-md sm:rounded-b-2xl sm:border-b sm:border-gray-100 sm:bg-white sm:p-4 sm:pb-4 sm:shadow-lg md:p-8">
      <div class="mb-1.5 sm:mb-4 md:mb-6">
        <span class="text-[10px] font-black uppercase tracking-[0.16em] text-center mx-auto justify-center flex my-4 text-white/50 sm:hidden">Seleccion tu Equipo</span>
        <h2 class="hidden sm:mb-2 sm:block sm:text-xl sm:font-bold sm:text-gray-900 md:text-2xl">Selecciona tu equipo</h2>
        <p class="hidden text-xs text-gray-600 sm:block sm:text-sm">Cambia entre los equipos a los que perteneces</p>
      </div>

      <div class="flex gap-1.5 mx-auto justify-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        <button
          v-for="equipo in equipos"
          :key="equipo.id"
          type="button"
          :aria-pressed="seleccionado === equipo.id"
          :class="[
            'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all duration-200 active:scale-[0.96] sm:w-full sm:shrink sm:min-w-0 sm:flex-col sm:justify-center sm:gap-0 sm:rounded-xl sm:border-2 sm:px-4 sm:py-3 sm:text-sm',
            seleccionado === equipo.id ? equipo.activo : equipo.inactivo
          ]"
          @click="$emit('change', equipo.id)"
        >
          <component :is="equipo.icono" class="size-3.5 sm:size-5" />
          <span class="sm:mt-1">{{ equipo.label }}</span>
        </button>
      </div>
    </div>

    <!-- Conector visual hacia las cards de eventos (solo mobile) -->
    <div class="flex justify-center rounded-b-2xl border border-t-0 border-white/10 bg-white/6 pb-2.5 backdrop-blur-md sm:hidden">
      <span :class="['h-1.5 w-14 rounded-full transition-colors duration-300', colorConector]"></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  seleccionado: {
    type: String,
    default: ''
  },
  equiposDisponibles: {
    type: Array,
    default: () => []
  }
});

defineEmits(['change']);

const configuracionEquipos = {
  ascenso: {
    label: 'Ascenso',
    icono: TrophyIcon,
    activo: 'border-teal-600 bg-teal-500 text-white shadow-lg',
    inactivo: 'border-gray-200 bg-gray-50 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
  },
  serieC: {
    label: 'Serie C',
    icono: ArrowTrendingUpIcon,
    activo: 'border-purple-600 bg-purple-500 text-white shadow-lg',
    inactivo: 'border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
  },
  escuela: {
    label: 'Escuela',
    icono: AcademicCapIcon,
    activo: 'border-yellow-600 bg-yellow-500 text-white shadow-lg',
    inactivo: 'border-gray-200 bg-gray-50 text-gray-700 hover:border-yellow-300 hover:bg-yellow-50'
  },
  ambos: {
    label: 'Eventos',
    icono: CalendarIcon,
    activo: 'border-indigo-600 bg-indigo-500 text-white shadow-lg',
    inactivo: 'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
  }
};

const colorConectorPorEquipo = {
  ascenso: 'bg-teal-500',
  serieC: 'bg-purple-500',
  escuela: 'bg-yellow-500',
  ambos: 'bg-indigo-500'
};

const equipos = computed(() => props.equiposDisponibles
  .map((id) => ({ id, ...configuracionEquipos[id] }))
  .filter((equipo) => equipo.label));

const colorConector = computed(() => colorConectorPorEquipo[props.seleccionado] || 'bg-primary');
</script>
